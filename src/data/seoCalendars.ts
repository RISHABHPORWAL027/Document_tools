export interface SeoCalendarDoc {
  id: string;
  slug: string;
  type: "holiday" | "compliance" | "long_weekend";
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  trustBadge: string;
  intro: string;
  overview: string;
  stateOrCategory: string;
  year: number;
  sections: { heading: string; paragraphs: string[] }[];
  highlights: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

export const SEO_CALENDARS: SeoCalendarDoc[] = [
  {
    id: "seo-cal-karnataka-holidays",
    slug: "karnataka-government-holiday-list-2026",
    type: "holiday",
    title: "Karnataka Government Holiday List 2026 – Public & Bank Holidays in Bengaluru",
    metaTitle: "Karnataka Government Holiday List 2026 – Public & Bank Holidays",
    metaDescription: "Official list of Karnataka state government holidays, public holidays, bank holidays, and festival dates for Bengaluru and all Karnataka districts in 2026.",
    keywords: ["Karnataka holiday list 2026", "Bengaluru bank holidays 2026", "Karnataka govt public holidays", "Kannada Rajyotsava 2026 date"],
    trustBadge: "Karnataka Govt Gazette Aligned",
    intro: "Check the complete official schedule of public, bank, national, and state holidays in Karnataka for the calendar year 2026.",
    overview: "Karnataka observes key state-specific holidays alongside mandatory national holidays, including Ugadi, Makar Sankranti, Ayudha Puja, Vijayadashami, and Kannada Rajyotsava on November 1st.",
    stateOrCategory: "karnataka",
    year: 2026,
    highlights: [
      { label: "Makar Sankranti / Pongal", value: "14 January 2026 (Wednesday)" },
      { label: "Republic Day (National)", value: "26 January 2026 (Monday)" },
      { label: "Ugadi (Gudi Padwa)", value: "19 March 2026 (Thursday)" },
      { label: "May Day / Labour Day", value: "01 May 2026 (Friday)" },
      { label: "Ganesh Chaturthi", value: "14 September 2026 (Monday)" },
      { label: "Mahatma Gandhi Jayanti", value: "02 October 2026 (Friday)" },
      { label: "Ayudha Puja / Mahanavami", value: "20 October 2026 (Tuesday)" },
      { label: "Vijayadashami (Dussehra)", value: "21 October 2026 (Wednesday)" },
      { label: "Kannada Rajyotsava", value: "01 November 2026 (Sunday)" },
      { label: "Deepavali (Diwali)", value: "08 November 2026 (Sunday)" },
    ],
    sections: [
      {
        heading: "State Festivals Unique to Karnataka",
        paragraphs: [
          "Kannada Rajyotsava (Karnataka Formation Day) celebrated on 1st November is a mandatory state public holiday across Bengaluru, Mysuru, Hubballi, and all districts.",
          "Ugadi marks the Kannada New Year based on the Hindu lunisolar calendar and is celebrated with traditional Bevu-Bella custom.",
        ],
      },
    ],
    faqs: [
      { question: "Are IT companies in Bengaluru required to declare Kannada Rajyotsava?", answer: "Yes, under the Karnataka Industrial Establishments (National and Festival Holidays) Act 1963, 1st November is a mandatory statutory holiday for commercial establishments and IT companies in Karnataka." },
    ],
  },

  {
    id: "seo-cal-long-weekends-2026",
    slug: "long-weekends-2026-india-calendar",
    type: "long_weekend",
    title: "Long Weekends in India 2026 – Vacation Dates & Leave Opportunities",
    metaTitle: "Long Weekends in India 2026 – Mini-Vacation Leave Calendar",
    metaDescription: "Complete list of natural 3-day long weekends and Take 1 Leave Get 4 Days Off bridge opportunities in India for 2026. Plan your holiday trips early.",
    keywords: ["long weekends 2026 India", "take 1 leave get 4 days off", "long weekend calendar 2026", "vacation leave planning India"],
    trustBadge: "Leave Optimizer 2026",
    intro: "Maximize your paid annual leave quota by planning mini-vacations around natural 3-day long weekends and 4-day leave bridge opportunities in 2026.",
    overview: "2026 features over 8 major long weekend windows where taking just 1 day of casual or privilege leave yields a 4-day continuous holiday break.",
    stateOrCategory: "all",
    year: 2026,
    highlights: [
      { label: "Jan 24 - Jan 26 (3 Days)", value: "Saturday + Sunday + Monday (Republic Day)" },
      { label: "Apr 03 - Apr 05 (3 Days)", value: "Friday (Good Friday) + Saturday + Sunday" },
      { label: "May 01 - May 03 (3 Days)", value: "Friday (May Day) + Saturday + Sunday" },
      { label: "Sep 12 - Sep 14 (3 Days)", value: "Saturday + Sunday + Monday (Ganesh Chaturthi)" },
      { label: "Oct 02 - Oct 04 (3 Days)", value: "Friday (Gandhi Jayanti) + Saturday + Sunday" },
      { label: "Dec 25 - Dec 27 (3 Days)", value: "Friday (Christmas) + Saturday + Sunday" },
      { label: "Take 1 Leave Bridge (4 Days)", value: "Jan 01 (Thu) + Take Fri Off + Sat + Sun" },
    ],
    sections: [
      {
        heading: "How to Turn 15 Annual Leaves Into 45 Days Off",
        paragraphs: [
          "By strategically applying for paid leave on Friday following a Thursday holiday or Monday preceding a Tuesday holiday, employees can achieve an efficiency multiplier of 3x to 4x on their leaves.",
        ],
      },
    ],
    faqs: [
      { question: "What is a Leave Bridge Opportunity?", answer: "A leave bridge occurs when a public holiday falls on a Thursday or Tuesday. Taking 1 leave on the intervening Friday or Monday connects the holiday directly to the weekend, creating a 4-day break." },
    ],
  },

  {
    id: "seo-cal-gst-due-dates",
    slug: "gst-return-due-date-calendar-2026",
    type: "compliance",
    title: "GST Return Due Date Calendar 2026 – GSTR-1, GSTR-3B & CMP-08",
    metaTitle: "GST Return Due Date Calendar 2026 – GSTR-1 & GSTR-3B Deadlines",
    metaDescription: "Check official monthly and quarterly GST return filing due dates for 2026. Deadlines for GSTR-1 (11th), GSTR-3B (20th), GSTR-7, GSTR-8, and CMP-08.",
    keywords: ["GST due date calendar 2026", "GSTR 3B due date", "GSTR 1 monthly deadline", "GST late fee penalties"],
    trustBadge: "CBIC Portal Validated",
    intro: "Stay compliant with Central Board of Indirect Taxes and Customs (CBIC) statutory filing deadlines to avoid interest at 18% p.a. and daily late fee penalties.",
    overview: "Monthly GST taxpayers must file GSTR-1 by the 11th and GSTR-3B by the 20th of every month. Quarterly taxpayers under QRMP scheme file CMP-08 by the 18th following quarter end.",
    stateOrCategory: "gst",
    year: 2026,
    highlights: [
      { label: "GSTR-7 & GSTR-8 (TDS/TCS)", value: "10th of every month" },
      { label: "GSTR-1 Outward Supply", value: "11th of every month" },
      { label: "IFF (QRMP Scheme)", value: "13th of every month" },
      { label: "GSTR-3B Summary Return", value: "20th of every month" },
      { label: "CMP-08 (Composition Scheme)", value: "18th following quarter end" },
    ],
    sections: [
      {
        heading: "GST Late Fee & Interest Rules 2026",
        paragraphs: [
          "Filing GSTR-3B after the 20th attracts a mandatory late fee of ₹50 per day (₹20 per day for Nil returns) capped at statutory limits, plus 18% per annum interest on net cash tax paid.",
          "Failing to file GSTR-1 blocks generation of GSTR-1 for subsequent tax periods on the GST portal.",
        ],
      },
    ],
    faqs: [
      { question: "What is the penalty for late filing of GSTR-3B?", answer: "Late fee is ₹50 per day (₹25 CGST + ₹25 SGST) for tax-payable returns, and ₹20 per day (₹10 CGST + ₹10 SGST) for Nil returns, along with 18% p.a. interest." },
    ],
  },
];

export function getSeoCalendarBySlug(slug: string): SeoCalendarDoc | undefined {
  return SEO_CALENDARS.find((c) => c.slug === slug);
}
