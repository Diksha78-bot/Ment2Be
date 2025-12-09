# Forum Service Usage Examples

## Quick Start

### 1. Import the Service
```javascript
import * as forumService from '../services/forumService';
```

## Complete Examples

### Example 1: Display All Questions

```javascript
import React, { useState, useEffect } from 'react';
import * as forumService from '../services/forumService';

function ForumPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await forumService.getAllQuestions(page, 10);
        setQuestions(result.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page]);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Forum Questions</h1>
      {questions.map(q => (
        <div key={q._id} className="question-card">
          <h3>{q.title}</h3>
          <p>{q.content}</p>
          <span className="category">{q.category}</span>
          <span className="upvotes">👍 {q.upvotes}</span>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}

export default ForumPage;
```

### Example 2: Create a Question Modal

```javascript
import React, { useState } from 'react';
import * as forumService from '../services/forumService';

function CreateQuestionModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await forumService.createQuestion(formData);
      
      // Success
      onSuccess(result.question);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        category: 'general'
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ask a Question</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What's your question?"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>Details</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Provide more details about your question..."
              required
              rows={6}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="general">General</option>
              <option value="engineering">Engineering</option>
              <option value="data-science">Data Science</option>
              <option value="business">Business</option>
              <option value="product">Product</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Posting...' : 'Post Question'}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateQuestionModal;
```

### Example 3: Question Detail with Answers

```javascript
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as forumService from '../services/forumService';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const result = await forumService.getQuestionById(id);
        setQuestion(result.question);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    
    if (!answerText.trim()) return;

    try {
      setSubmitting(true);
      const result = await forumService.answerQuestion(id, answerText);
      setQuestion(result.question);
      setAnswerText('');
    } catch (err) {
      alert('Error adding answer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async () => {
    try {
      const result = await forumService.upvoteQuestion(id);
      setQuestion(prev => ({
        ...prev,
        upvotes: result.upvotes
      }));
    } catch (err) {
      alert('Error upvoting: ' + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!question) return <div>Question not found</div>;

  return (
    <div className="question-detail">
      <div className="question-header">
        <h1>{question.title}</h1>
        <button onClick={handleUpvote} className="upvote-btn">
          👍 {question.upvotes} Upvotes
        </button>
      </div>

      <div className="question-body">
        <p>{question.content}</p>
        <span className="category">{question.category}</span>
        <span className="author">Asked by {question.author.name}</span>
      </div>

      <div className="answers-section">
        <h2>Answers ({question.answers.length})</h2>
        
        {question.answers.map((answer, idx) => (
          <div key={idx} className="answer">
            <p>{answer.content}</p>
            <span className="answer-author">By {answer.author.name}</span>
            <span className="answer-upvotes">👍 {answer.upvotes}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddAnswer} className="answer-form">
        <h3>Your Answer</h3>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Write your answer here..."
          rows={6}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Answer'}
        </button>
      </form>
    </div>
  );
}

export default QuestionDetail;
```

### Example 4: Search Questions

```javascript
import React, { useState, useEffect } from 'react';
import * as forumService from '../services/forumService';

function SearchForum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setSearched(true);
      const result = await forumService.searchQuestions(
        searchQuery,
        category || null
      );
      setResults(result.questions);
    } catch (err) {
      alert('Error searching: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-forum">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions..."
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="engineering">Engineering</option>
          <option value="data-science">Data Science</option>
          <option value="business">Business</option>
          <option value="product">Product</option>
          <option value="general">General</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div className="search-results">
          <p>Found {results.length} results</p>
          {results.map(q => (
            <div key={q._id} className="search-result">
              <h3>{q.title}</h3>
              <p>{q.content.substring(0, 100)}...</p>
              <span>{q.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchForum;
```

### Example 5: Filter by Category

```javascript
import React, { useState, useEffect } from 'react';
import * as forumService from '../services/forumService';

function CategoryQuestions({ category }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchByCategory = async () => {
      try {
        setLoading(true);
        const result = await forumService.getQuestionsByCategory(category, page);
        setQuestions(result.questions);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [category, page]);

  return (
    <div>
      <h2>{category} Questions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {questions.map(q => (
            <div key={q._id} className="question-card">
              <h3>{q.title}</h3>
              <p>{q.content}</p>
              <span>👍 {q.upvotes}</span>
            </div>
          ))}
          <button onClick={() => setPage(page + 1)}>Load More</button>
        </>
      )}
    </div>
  );
}

export default CategoryQuestions;
```

## Error Handling

All service methods throw errors that should be caught:

```javascript
try {
  const result = await forumService.createQuestion(data);
} catch (error) {
  // Handle error
  console.error('Error:', error.message);
  // Show error to user
}
```

## Authentication

All protected endpoints automatically use the token from localStorage:

```javascript
// Token is automatically included in Authorization header
const token = localStorage.getItem('token');
// forumService methods handle this automatically
```

## Pagination

Most endpoints support pagination:

```javascript
// Get page 2 with 20 items per page
const result = await forumService.getAllQuestions(2, 20);
console.log(result.pagination); // { total, page, limit, pages }
```

## Switching Backends

To switch from Node.js to Java backend:

1. Edit `/Frontend/src/config/apiConfig.js`
2. Change: `const ACTIVE_BACKEND = 'java';`
3. All API calls automatically use Java backend
4. No component code changes needed!

## Tips

- Always handle loading and error states
- Use pagination for better performance
- Cache questions when possible
- Show user feedback for async operations
- Validate form data before submission
