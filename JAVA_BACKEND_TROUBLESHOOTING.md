# Java Backend - Forum Troubleshooting Guide

## Error: "Failed to fetch" when using Java backend

### Common Causes and Solutions:

### 1. **Java Backend Not Running**
**Symptom**: `TypeError: Failed to fetch`

**Solution**:
```bash
# In Backend folder, run:
mvn spring-boot:run

# Or if using Maven wrapper:
./mvnw spring-boot:run
```

**Verify it's running**:
- Open browser: `http://localhost:8081`
- Should see Spring Boot startup logs
- Look for: `🔵 [FORUM - JAVA]` logs in console

---

### 2. **CORS Issues**
**Symptom**: Network error, but backend is running

**Solution**: The Java ForumController already has CORS enabled:
```java
@CrossOrigin(origins = "*", maxAge = 3600)
public class ForumController {
```

If still having issues, add to `application.properties`:
```properties
server.servlet.context-path=/
spring.web.cors.allowed-origins=*
spring.web.cors.allowed-methods=*
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

---

### 3. **Wrong Port**
**Symptom**: Connection refused

**Check**:
- Java backend runs on: `http://localhost:8081`
- Node.js backend runs on: `http://localhost:4000`
- Frontend config should have: `ACTIVE_BACKEND = 'java'`

**Verify in apiConfig.js**:
```javascript
const ACTIVE_BACKEND = 'java'; // ✅ Should be 'java'

const BASE_URLS = {
  nodejs: 'http://localhost:4000',
  java: 'http://localhost:8081'  // ✅ Correct port
};
```

---

### 4. **MongoDB Connection Issue**
**Symptom**: Backend runs but returns 500 errors

**Solution**: Ensure MongoDB is running:
```bash
# On Windows:
mongod

# On Mac:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod
```

**Verify MongoDB is running**:
```bash
mongo
# Should connect successfully
```

---

### 5. **Missing Dependencies**
**Symptom**: Compilation errors when running Java backend

**Solution**: Ensure `pom.xml` has these dependencies:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

Then run:
```bash
mvn clean install
mvn spring-boot:run
```

---

### 6. **Check Browser Console**
Look for the URL being called:

```
📡 Fetching from: http://localhost:8081/api/forum/questions?page=1&limit=50&sort=-createdAt
```

**If URL is wrong**:
- Check `apiConfig.js` - is `ACTIVE_BACKEND = 'java'`?
- Refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache

---

### 7. **Check Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for request to `/api/forum/questions`
5. Check:
   - **URL**: Should be `http://localhost:8081/api/forum/questions`
   - **Status**: Should be 200 (not 404, 500, or CORS error)
   - **Response**: Should have JSON with questions

---

### 8. **Enable Debug Logging**
To see detailed logs, add to `application.properties`:
```properties
logging.level.com.mentorlink=DEBUG
logging.level.org.springframework.web=DEBUG
```

Then watch console for:
```
🔵 [FORUM - JAVA] GET /api/forum/questions - Fetching all questions
```

---

### 9. **Test with cURL**
```bash
# Test if Java backend is responding
curl -X GET http://localhost:8081/api/forum/questions?page=1&limit=10

# Should return JSON with questions
```

---

### 10. **Quick Checklist**
- [ ] Java backend running (`mvn spring-boot:run`)
- [ ] MongoDB running (`mongod`)
- [ ] `ACTIVE_BACKEND = 'java'` in apiConfig.js
- [ ] Browser refreshed (Ctrl+F5)
- [ ] No CORS errors in console
- [ ] Network tab shows 200 status
- [ ] URL is `http://localhost:8081/api/forum/...`

---

## Switching Back to Node.js

If Java backend has issues, quickly switch back:

**File**: `/Frontend/src/config/apiConfig.js`
```javascript
const ACTIVE_BACKEND = 'nodejs'; // Change back to Node.js
```

Then:
```bash
# Start Node.js backend
npm start
```

---

## Still Having Issues?

1. **Check logs**:
   - Java: Look for 🔵 blue logs in console
   - Node.js: Look for 🟢 green logs in terminal

2. **Check URLs**:
   - Java: `http://localhost:8081/api/forum`
   - Node.js: `http://localhost:4000/api/forum`

3. **Check network**:
   - DevTools → Network tab
   - Look at request URL and response status

4. **Restart everything**:
   - Kill Java backend (Ctrl+C)
   - Kill Node.js backend (Ctrl+C)
   - Kill MongoDB
   - Start MongoDB first
   - Start Java backend
   - Refresh browser

---

## Success Indicators

When Java backend is working correctly, you should see:

**In Browser Console**:
```
📡 Fetching from: http://localhost:8081/api/forum/questions?page=1&limit=50&sort=-createdAt
```

**In Java Backend Console**:
```
🔵 [FORUM - JAVA] GET /api/forum/questions - Fetching all questions
```

**In Network Tab**:
- URL: `http://localhost:8081/api/forum/questions...`
- Status: `200 OK`
- Response: JSON with questions array
