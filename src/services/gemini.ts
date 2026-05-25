

export interface RoastResponse {
  product_name: string;
  one_line_verdict: string;
  overall_score: number;
  scores: {
    first_impression: number;
    problem_clarity: number;
    onboarding_activation: number;
    ux_clarity: number;
    trust_credibility: number;
    monetization: number;
    retention: number;
    differentiation: number;
    growth_potential: number;
  };
  what_works: string[];
  what_fails: string[];
  top_3_fixes: string[];
  best_growth_angle: string;
  likely_target_user: string;
  likely_monetization_model: string;
  pm_recommendation: string;
  linkedin_hook: string;
  substack_hook: string;
  confidence: number;
  evidence_used: string[];
  missing_information: string[];
}

// -------------------------------------------------------------
// Pre-loaded Demo Roast (When offline or no API Key is provided)
// -------------------------------------------------------------
export const demoRoast: RoastResponse = {
  product_name: "SaaSifyMetrics AI",
  one_line_verdict: "A generic analytics wrapper selling AI magic for a problem solved 10 years ago by simple DB queries.",
  overall_score: 4.4,
  scores: {
    first_impression: 5,
    problem_clarity: 4,
    onboarding_activation: 3,
    ux_clarity: 6,
    trust_credibility: 4,
    monetization: 5,
    retention: 3,
    differentiation: 3,
    growth_potential: 7
  },
  what_works: [
    "Sleek layout with a unified dark mode that feels visually premium at first glance.",
    "Quick-glance charts display data updates fast, giving a sense of active system monitoring.",
    "The 'Connect Stripe' CTA is cleanly highlighted with a distinct color border."
  ],
  what_fails: [
    "The hero heading 'Leverage AI to Hyper-Optimize Revenue' is complete buzzword soup. It fails to explain what actually happens when I click connect.",
    "Requires a Stripe connection *before* demonstrating any value. This creates an immediate conversion drop-off of 70%+.",
    "Total absence of trust signals. No customer logos, security compliance badges (SOC2/GDPR), or explanations of how financial credentials are kept safe.",
    "The dashboard mixes high-level MRR metrics with granular database read counts. It shows a severe lack of focus on who the customer actually is: is this for the CFO or the Database Administrator?"
  ],
  top_3_fixes: [
    "Replace the buzzword-heavy header with a direct benefit statement: 'Forecast churn & detect leaking subscriptions in 2 clicks. No manual modeling required.'",
    "Implement a sandbox demo state. Allow users to explore a mock dashboard with interactive metrics before forcing them to hook up their live Stripe accounts.",
    "Add a dedicated security block next to the connection screen. Explain in plain English: 'Read-only API access. We never touch your funds. 256-bit encryption.'"
  ],
  best_growth_angle: "Create a free 'Stripe Leakage Calculator' tool that analyzes the last 30 days of Stripe invoices and generates a shareable leak report. Push this on Hacker News and Twitter.",
  likely_target_user: "Seed-stage SaaS founders who have 50-200 customers and want to monitor subscription health without building internal SQL dashboards.",
  likely_monetization_model: "Usage-based freemium. Free up to $10k MRR, then $49/mo flat rate, scaling based on invoice volume.",
  pm_recommendation: "Pivot away from generic 'revenue optimization' towards 'churn leak detection.' Focus entirely on showing SaaS founders which specific accounts are about to cancel, as this is a high-pain point that triggers direct ROI. Delay Stripe authorization until the user understands what insight they get in return.",
  linkedin_hook: "🔥 SaaSifyMetrics claims to optimize revenue with AI, but it is actually a $49/mo wrapper for SQL commands that pre-dates ChatGPT. Here is why forcing Stripe connection on step 1 is killing their activation funnel... 👇",
  substack_hook: "In this week's PM breakdown: Why 'AI revenue optimization' is the new default buzzword for SaaS apps, and a masterclass on how to fix a high-friction Stripe onboarding flow that leaks 70% of signups.",
  confidence: 85,
  evidence_used: [
    "Hero copy: 'Leverage AI to Hyper-Optimize Revenue'",
    "Primary button: 'Connect Stripe Account'",
    "Sidebar layout displaying MRR, LTV, DB Read Counts, and Active Subscriptions",
    "Missing security text under connection area"
  ],
  missing_information: [
    "The post-connection UI dashboard flow",
    "Pricing page or sign-up form steps preceding this screen",
    "The target business's current signup-to-activation conversion rate"
  ]
};

// -------------------------------------------------------------
// Live Gemini API client wrapper
// -------------------------------------------------------------
export async function roastProduct(
  apiKey: string,
  imageFile: File,
  additionalContext: string
): Promise<RoastResponse> {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please configure it in settings.");
  }

  // Convert File to GenerativePart format
  const convertFileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const imagePart = await convertFileToGenerativePart(imageFile);

  // Initialize client using the newer SDK structure
  // Note: we can use a direct fetch request or the SDK's generateContent method
  // Direct fetch is often safer and easier in browsers because it bypasses node-dependent packaging issues.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `
You are "AI Product Roast", a brutally honest but extremely useful senior product manager, UX strategist, conversion-rate optimizer, and growth thinker.
Your job is to critique a product screenshot, landing page, app screen, onboarding flow, or UI flow with the goal of helping a PM improve it fast.

IMPORTANT BEHAVIOR RULES:
- Be direct, specific, and opinionated.
- Do NOT give generic feedback like "good UI" or "nice design".
- Do NOT flatter the product.
- Do NOT invent features, metrics, or context that are not visible in the input.
- Base your comments only on the visible screenshot / page / provided text.
- If something cannot be inferred, say "insufficient evidence" or add it to missing_information.
- Prefer concrete product thinking (funnels, onboarding friction, trust signals, activation) over pure visual taste.
- Think like a senior PM at a high-performing consumer or SaaS product company.
- Prioritize problems by impact.
- Focus on activation, retention, clarity, trust, conversion, and differentiation.
- Keep the analysis practical and actionable.
- If the screenshot is unclear, lower the confidence score and detail the ambiguity.
- Write in a sharp, confident, structured style.

OUTPUT REQUIREMENTS:
You MUST output ONLY a valid JSON object matching the schema below. Do not wrap it in markdown block like \`\`\`json. Return only raw JSON.

Schema:
{
  "product_name": "The name of the product or 'Unknown'",
  "one_line_verdict": "A sharp, witty, critical one-sentence summary of the product's main failure or current status",
  "overall_score": 0.0, // Rounded average of the 9 scores below (0 to 10 scale)
  "scores": {
    "first_impression": 0, // 3-second value proposition clarity, layout noise
    "problem_clarity": 0, // Is the pain point obvious?
    "onboarding_activation": 0, // Speed to value, signup/setup friction
    "ux_clarity": 0, // Element hierarchy, labels, clutter
    "trust_credibility": 0, // Social proof, security indicators, credibility
    "monetization": 0, // Business model clarity, value/pricing alignment
    "retention": 0, // Return loop trigger, daily habit potential
    "differentiation": 0, // Clone/wrapper vs original concept
    "growth_potential": 0 // Sharing, virality, distribution potential
  },
  "what_works": [
    "Bullet points of actual good things, if any (keep it brief and real)"
  ],
  "what_fails": [
    "Detailed bullet points of product weaknesses, friction points, or copy failures"
  ],
  "top_3_fixes": [
    "Prioritized, high-impact changes to make in the next 30 days. Be highly specific (e.g. 'Move CTA above fold', 'Replace buzzwords with X')"
  ],
  "best_growth_angle": "A creative, high-leverage distribution channel or viral loop suited to this product",
  "likely_target_user": "Define the narrow customer profile that has this specific pain point",
  "likely_monetization_model": "E.g. Freemium, B2B SaaS subscription, usage billing, ad-supported",
  "pm_recommendation": "A short, actionable strategy note written directly to the product owner",
  "linkedin_hook": "A spicy, click-worthy LinkedIn post hook summarizing the roast to share with peers",
  "substack_hook": "A catchy, analytical email subject line / hook for a Substack product teardown newsletter",
  "confidence": 0, // 0 to 100 confidence score based on the screenshot details
  "evidence_used": [
    "List of specific UI elements, texts, or buttons seen in the screenshot that backed your analysis"
  ],
  "missing_information": [
    "What key details were invisible but crucial to confirm your theories"
  ]
}
`;

  const promptText = `
Analyze this product screenshot. 
${additionalContext ? `Additional context provided by user: "${additionalContext}"` : "No additional text context was provided."}

Remember, evaluate it brutally and honestly. Return ONLY the JSON object.
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: systemInstruction
            },
            {
              text: promptText
            },
            {
              inlineData: imagePart.inlineData
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText || 'Unknown error occurred.'}`);
  }

  const resultData = await response.json();
  const rawText = resultData.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawText) {
    throw new Error("Empty response from Gemini API.");
  }

  // Parse the JSON. Clean up any accidental markdown blocks if present.
  let cleanedText = rawText.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.substring(7);
  }
  if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.substring(3);
  }
  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.substring(0, cleanedText.length - 3);
  }
  cleanedText = cleanedText.trim();

  try {
    const parsed: RoastResponse = JSON.parse(cleanedText);
    return parsed;
  } catch (parseError) {
    console.error("Failed to parse Gemini output as JSON. Output was:", rawText);
    throw new Error("Gemini returned invalid JSON structure. Check the console logs for details.");
  }
}
