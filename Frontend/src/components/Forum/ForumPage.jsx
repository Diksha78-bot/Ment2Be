"use client"

import { useState } from "react"
import './ForumPage.css'
import {
  Search,
  Zap,
  Monitor,
  BarChart3,
  Briefcase,
  Lightbulb,
  ChevronDown,
  Play,
  ArrowUpRight,
  ArrowRight,
  PenLine,
} from "lucide-react"

const domains = [
  { id: "for-you", label: "For You", icon: Zap },
  { id: "engineering", label: "Engineering", icon: Monitor },
  { id: "data-science", label: "Data Science", icon: BarChart3 },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "product", label: "Product", icon: Lightbulb },
]

const questions = [
  {
    id: 1,
    author: "Rituparna Padira",
    date: "24 Nov 2025",
    avatar: "",
    content:
      "1. Could you kindly review my resume (sent in chats) and share your thoughts. What can I improve to strengthen my chances of getting shortlisted in microsoft ? Anything which I should remove? 2. Can you...",
    answerPreview: null,
    upvotes: 0,
    answers: 0,
  },
  {
    id: 2,
    author: "Monica Bhattacharya",
    date: "12 Nov 2025",
    avatar: "",
    content:
      "I am 2023 B.Tech graduate in Computer Science and looking forward to get into product based companies. I am learning MERN stack development from NxtWave Technologies. I have zero knowledge on DSA. I want to learn DSA from scratch through free resources from YouTube or any other platforms. 1. Will I secure a perfect job with 2+years of career gap? 2. Do MERN full stack is sufficient to crack Small companies with a decent package of 6 to 10 LPA? Orelse, I need to learn DSA must and should for lower packages? 3. What are the packages and names of the companies offering those packages does a candidate can get with zero DSA knowledge?",
    answerPreview:
      "Hi, a career gap isn't a big issue if you show solid skills and consistent learning. MERN helps you get into smaller product companies, but DSA is important if you want better stability, stronger interviews and higher packages. Without DSA you can still get roles, but the options and pay ranges shrink fast....",
    upvotes: 0,
    answers: 1,
  },
  {
    id: 3,
    author: "Amit Sharma",
    date: "10 Nov 2025",
    avatar: "",
    content:
      "I'm currently working as a frontend developer with 3 years of experience. I want to transition into a full-stack role. What technologies should I focus on learning first? Should I go with Node.js or Python for backend?",
    answerPreview:
      "Great question! With your frontend experience, Node.js would be a natural transition since you already know JavaScript. However, Python opens up more opportunities in data science and ML if that interests you...",
    upvotes: 5,
    answers: 3,
  },
]

export function ForumPage() {
  const [selectedDomain, setSelectedDomain] = useState("for-you")
  const [sortBy, setSortBy] = useState("Most Recent")

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div className="h-screen bg-[#202327] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-8 h-full">
        <div className="flex gap-8 h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
            {/* Header */}
            <h1 className="text-2xl font-bold text-white mb-2">Forum - Ask Mentor Anything</h1>
            <p className="text-[#b3b3b3] mb-6">
              Answering doubts posed by mentees to aid in their preparation not only benefits them but also helps you
              build a stronger profile, consequently leading to more trial bookings.
            </p>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
              <input
                type="text"
                placeholder="Search Questions Here"
                className="w-full pl-12 h-12 border border-[#404040] rounded-lg text-blue-500 placeholder:text-blue-500 bg-[#121212] focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Browse Domains */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white mb-4 underline">Browse all Domains:</h2>
              <div className="flex gap-3 flex-wrap">
                {domains.map((domain) => {
                  const Icon = domain.icon
                  const isSelected = selectedDomain === domain.id
                  return (
                    <button
                      key={domain.id}
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`flex flex-col items-center justify-center px-6 py-4 rounded-lg border transition-all min-w-[100px] ${
                        isSelected
                          ? "border-blue-500 text-blue-500 bg-[#121212]"
                          : "border-[#404040] text-[#b3b3b3] hover:border-blue-300 bg-[#121212]"
                      }`}
                    >
                      <Icon className="h-6 w-6 mb-2" />
                      <span className="text-sm font-medium">{domain.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Questions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Questions</h2>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                  <span>Sort by:</span>
                  <button className="flex items-center gap-1 font-medium text-white">
                    {sortBy}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#404040] mb-4" />

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="p-5 border border-[#404040] rounded-lg bg-[#121212]">
                    {/* Author Info */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-medium">
                          {question.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <span className="text-sm text-[#b3b3b3]">
                        Asked by <span className="font-medium text-white">{question.author}</span>
                      </span>
                      <span className="text-[#535353]">|</span>
                      <span className="text-sm text-[#b3b3b3]">{question.date}</span>
                    </div>

                    {/* Question Content */}
                    <p className="text-white font-medium leading-relaxed mb-4">{question.content}</p>

                    {/* Answer Preview */}
                    {question.answerPreview && (
                      <div className="mb-4">
                        <p className="text-[#b3b3b3] text-sm leading-relaxed">{question.answerPreview}</p>
                        <button className="text-blue-500 text-sm font-medium mt-2 hover:underline">
                          Read Full Answer
                        </button>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#404040]">
                      <div className="flex items-center gap-6">
                        <span className="text-sm text-[#b3b3b3]">{question.upvotes} Upvotes</span>
                        <div className="flex items-center gap-1.5 text-sm text-[#b3b3b3]">
                          <PenLine className="h-4 w-4" />
                          <span>{question.answers} Answers</span>
                        </div>
                      </div>
                      <button className="bg-white text-black hover:bg-gray-200 rounded-lg px-4 py-2 font-medium transition-colors">
                        Answer Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 shrink-0 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Getting Mentees Card */}
            <div className="p-4 border border-[#404040] rounded-lg bg-[#121212]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                  </div>
                  <span className="font-medium text-white">Getting Mentees through Forum</span>
                </div>
                <ArrowUpRight className="h-5 w-5 text-[#b3b3b3]" />
              </div>
            </div>

            {/* User Profile Card */}
            <div className="p-4 border border-[#404040] rounded-lg bg-[#121212]">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-amber-700 font-medium">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'RD'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user?.name || 'Raghu Datta'}</h3>
                  <p className="text-sm text-blue-500">Mentor</p>
                </div>
              </div>
            </div>

            {/* My Answers Card */}
            <div className="p-4 border border-[#404040] rounded-lg bg-[#121212] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-full opacity-60">
                <div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
                    backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                  `,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-white mb-2">My Answers</h3>
                <p className="text-4xl font-bold text-white mb-2">0</p>
                <a href="#" className="text-blue-500 text-sm flex items-center gap-1 hover:underline">
                  View My Answers <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Requested Answers Card */}
            <div className="p-4 border border-[#404040] rounded-lg bg-[#121212] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-full opacity-60">
                <div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 50%, #c084fc 100%)",
                    backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                  `,
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-white mb-2">Requested Answers</h3>
                <p className="text-4xl font-bold text-white mb-2">0</p>
                <a href="#" className="text-blue-500 text-sm flex items-center gap-1 hover:underline">
                  View Requested Answers <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Leaderboard Card */}
            <div className="p-4 border border-[#404040] rounded-lg bg-[#121212]">
              <h3 className="font-semibold text-white">Leaderboard</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
