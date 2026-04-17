import { subDays } from 'date-fns';

export const DSA_TOPICS_DUMMY = [
  { id: 1, title: 'Two Sum', category: 'Array', status: 'Done', confidence: 'High', difficulty: 'Easy', platform: 'LeetCode', link: 'https://leetcode.com/problems/two-sum', notes: 'Hash map is O(n)', time_taken: 300 },
  { id: 2, title: 'Best Time to Buy and Sell Stock', category: 'Array', status: 'Done', confidence: 'Med', difficulty: 'Easy', platform: 'LeetCode', link: '', notes: '', time_taken: 600 },
  { id: 3, title: 'Longest Substring Without Repeating Characters', category: 'String', status: 'In Progress', confidence: 'Low', difficulty: 'Medium', platform: 'LeetCode', link: '', notes: '', time_taken: null },
  { id: 4, title: 'Valid Palindrome', category: 'String', status: 'Done', confidence: 'High', difficulty: 'Easy', platform: 'LeetCode', link: '', notes: '', time_taken: 400 },
  { id: 5, title: 'Reverse Linked List', category: 'Linked List', status: 'Done', confidence: 'High', difficulty: 'Easy', platform: 'LeetCode', link: '', notes: '', time_taken: 500 },
  { id: 6, title: 'Merge K Sorted Lists', category: 'Linked List', status: 'Not Started', confidence: '-', difficulty: 'Hard', platform: 'LeetCode', link: '', notes: '', time_taken: null },
  { id: 7, title: 'Invert Binary Tree', category: 'Trees', status: 'Done', confidence: 'Med', difficulty: 'Easy', platform: 'LeetCode', link: '', notes: '', time_taken: 350 },
  { id: 8, title: 'Binary Tree Maximum Path Sum', category: 'Trees', status: 'In Progress', confidence: 'Low', difficulty: 'Hard', platform: 'GFG', link: '', notes: '', time_taken: null },
  { id: 9, title: 'Number of Islands', category: 'Graphs', status: 'Not Started', confidence: '-', difficulty: 'Medium', platform: 'HackerRank', link: '', notes: '', time_taken: null },
  { id: 10, title: 'Course Schedule', category: 'Graphs', status: 'In Progress', confidence: 'Low', difficulty: 'Medium', platform: 'GFG', link: '', notes: '', time_taken: null },
  { id: 11, title: 'Climbing Stairs', category: 'Dynamic Programming', status: 'Done', confidence: 'High', difficulty: 'Easy', platform: 'LeetCode', link: '', notes: '', time_taken: 200 },
  { id: 12, title: 'Coin Change', category: 'Dynamic Programming', status: 'In Progress', confidence: 'Low', difficulty: 'Medium', platform: 'LeetCode', link: '', notes: '', time_taken: null },
  { id: 13, title: 'Longest Increasing Subsequence', category: 'Dynamic Programming', status: 'Not Started', confidence: '-', difficulty: 'Medium', platform: 'LeetCode', link: '', notes: '', time_taken: null },
];

export const COMPANIES_DUMMY = [
  { id: '1', name: 'Google', role: 'SDE 1', stage: 'Interviewing' },
  { id: '2', name: 'Microsoft', role: 'Frontend Engineer', stage: 'Applied' },
  { id: '3', name: 'Amazon', role: 'SDE', stage: 'Offer' },
  { id: '4', name: 'Meta', role: 'Production Engineer', stage: 'Rejected' },
  { id: '5', name: 'Apple', role: 'UI Developer', stage: 'Wishlist' },
];

export const APTITUDE_LOGS_DUMMY = [
  { id: 1, date: subDays(new Date(), 4).toISOString(), mainTopic: 'Quantitative', subTopic: 'Time & Work', attempted: 10, correct: 6, timeTaken: 15*60 },
  { id: 2, date: subDays(new Date(), 3).toISOString(), mainTopic: 'Logical', subTopic: 'Puzzles', attempted: 15, correct: 10, timeTaken: 20*60 },
  { id: 3, date: subDays(new Date(), 2).toISOString(), mainTopic: 'Verbal', subTopic: 'Reading Comp', attempted: 10, correct: 8, timeTaken: 12*60 },
  { id: 4, date: subDays(new Date(), 1).toISOString(), mainTopic: 'Quantitative', subTopic: 'Profit & Loss', attempted: 20, correct: 17, timeTaken: 25*60 },
];

export const APTITUDE_MISTAKES_DUMMY = [
  { id: 'm1', topic: 'Time & Work', question: 'If A does 1/3 of a work in 5 days...', explanation: 'A takes 15 days total. Always calculate 1-day work first!' },
  { id: 'm2', topic: 'Puzzles', question: 'Six people sitting around a circular table...', explanation: 'Always start with the most constrained condition, usually involving "facing center".' }
];

export const generateHeatmapLogs = () => {
    let logs = [];
    const today = new Date();
    for(let i=0; i<45; i++) {
        if (Math.random() > 0.3) {
            logs.push({
                date: subDays(today, i).toISOString(),
                count: Math.floor(Math.random() * 8) + 1
            });
        }
    }
    return logs;
};
