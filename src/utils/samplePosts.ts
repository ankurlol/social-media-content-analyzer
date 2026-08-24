export interface SamplePostItem {
  id: string;
  title: string;
  category: string;
  description: string;
  text: string;
}

export const SAMPLE_POSTS: SamplePostItem[] = [
  {
    id: 'sample-tech-launch',
    title: '🚀 SaaS Product Launch Announcement',
    category: 'Product & Tech',
    description: 'A launch post for a new developer productivity tool.',
    text: `After 9 months of silent building, we are finally launching DevFlow AI today! 🎉

Most engineering teams lose 30% of their sprint velocity to context switching and undocumented code reviews. 

We built DevFlow to solve this exact problem:
• Auto-generates PR context briefs
• Highlights breaking API contracts in real-time
• Integrates directly with GitHub and Slack

We're offering early-bird lifetime access to our first 100 beta testers.

👇 Check out the link in the first comment to try it free today!

What feature would make your daily dev workflow 10x faster? Let me know below!

#SoftwareEngineering #ProductLaunch #AI #DeveloperTools #TechInnovation`,
  },
  {
    id: 'sample-thought-leadership',
    title: '💡 Leadership & Career Lesson',
    category: 'Thought Leadership',
    description: 'A personal story-driven LinkedIn post on leadership and scaling.',
    text: `3 years ago, I almost burned out managing a team of 15 engineers.

I thought being a great leader meant having all the answers and reviewing every single commit.

Here is the mindset shift that saved my sanity:

1. Shift from micromanagement to context-setting.
2. Give ownership, not just tasks.
3. Treat mistakes as institutional learning, not personal failures.

When you empower your team to make decisions, velocity triples and morale soars.

📌 Save this post if you're stepping into leadership this year.

What is the best piece of management advice you ever received?

#Leadership #EngineeringManagement #CareerGrowth #WorkplaceCulture`,
  },
  {
    id: 'sample-scanned-flyer',
    title: '📄 Scanned Event Flyer / Promo',
    category: 'Marketing Event',
    description: 'Text extracted from a scanned conference invitation.',
    text: `GLOBAL AI & DATA SUMMIT 2026

Join 2,500+ tech leaders, researchers, and venture capitalists in San Francisco.

Keynote Speakers:
- Dr. Elena Vance (Lead AI Researcher)
- Marcus Chen (Founder & CEO, NeuralScale)

Topics Covered:
- Next-Gen Multimodal Agents
- Enterprise LLM Security & Compliance
- Scaling Distributed Data Pipelines

Early Bird Registration closes this Friday at Midnight!
Register now at www.aidatasummit2026.org to save 40% on all-access passes.

#AISummit #TechConference #MachineLearning #SanFrancisco #Networking`,
  },
  {
    id: 'sample-weak-draft',
    title: '⚠️ Unoptimized / Weak Draft (For Testing Improvements)',
    category: 'Unoptimized Draft',
    description: 'A raw draft without clear hooks or formatting to see analyzer suggestions in action.',
    text: `Hey guys, just wanted to share that we wrote a new blog post on our website about how to improve your website SEO. It has a lot of good tips and covers keywords and backlinks. If you want to check it out the link is on our website homepage. Thanks for reading.`,
  },
];
