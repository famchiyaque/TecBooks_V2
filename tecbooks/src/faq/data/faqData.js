import {
  Building2,
  GraduationCap,
  User,
  Lock,
  Users,
  UserCircle,
  KeyRound,
  LayoutDashboard,
  FileText,
  TrendingUp,
  PiggyBank,
  LineChart,
  BarChart3,
  Gauge,
  Factory,
  Zap,
  ChartLine,
  TrendingDown,
  Calculator,
  FolderInput,
  FolderOutput,
  ClipboardList,
} from "lucide-react";

export const faqData = [
  {
    id: "register",
    title: "Register",
    icon: UserCircle,
    subsections: [
      {
        id: "register-institution",
        title: "Register your institution",
        icon: Building2,
        items: [],
      },
      {
        id: "register-professor",
        title: "Register as a professor",
        icon: GraduationCap,
        items: [],
      },
      {
        id: "register-student",
        title: "Register as a student",
        icon: User,
        items: [],
      },
    ],
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: Lock,
    subsections: [
      {
        id: "accounts-students",
        title: "Students",
        icon: Users,
        items: [],
      },
      {
        id: "accounts-professors",
        title: "Professors",
        icon: GraduationCap,
        items: [],
      },
      {
        id: "accounts-forgot-password",
        title: "Forgot Password?",
        icon: KeyRound,
        items: [],
      },
    ],
  },
  {
    id: "financial-dashboard",
    title: "Financial Dashboard",
    icon: LayoutDashboard,
    subsections: [
      {
        id: "financial-dashboard-overview",
        title: "Overview",
        icon: LayoutDashboard,
        items: [
          {
            id: "financial-dashboard-overview-general",
            title: "General",
            icon: FileText,
          },
        ],
      },
      {
        id: "financial-dashboard-statements",
        title: "Financial Statements",
        icon: FileText,
        items: [
          {
            id: "financial-dashboard-statements-general",
            title: "General",
            icon: FileText,
          },
          {
            id: "financial-dashboard-statements-income",
            title: "Income Statement",
            icon: TrendingUp,
          },
          {
            id: "financial-dashboard-statements-balance",
            title: "Balance Sheet",
            icon: BarChart3,
          },
          {
            id: "financial-dashboard-statements-cashflows",
            title: "Cashflows",
            icon: PiggyBank,
          },
        ],
      },
      {
        id: "financial-dashboard-health",
        title: "Financial Health",
        icon: Gauge,
        items: [
          {
            id: "financial-dashboard-health-general",
            title: "General",
            icon: FileText,
          },
          {
            id: "financial-dashboard-health-liquidity",
            title: "Liquidity",
            icon: TrendingUp,
          },
          {
            id: "financial-dashboard-health-profitability",
            title: "Profitability",
            icon: LineChart,
          },
          {
            id: "financial-dashboard-health-efficiency",
            title: "Efficiency",
            icon: Zap,
          },
        ],
      },
    ],
  },
  {
    id: "productivity",
    title: "Productivity",
    icon: Factory,
    subsections: [
      {
        id: "productivity-general",
        title: "General",
        icon: FileText,
        items: [],
      },
      {
        id: "productivity-capacity",
        title: "Capacity",
        icon: Gauge,
        items: [],
      },
      {
        id: "productivity-efficiency",
        title: "Efficiency",
        icon: Zap,
        items: [],
      },
      {
        id: "productivity-productivity",
        title: "Productivity",
        icon: ChartLine,
        items: [],
      },
    ],
  },
  {
    id: "forecasts",
    title: "Forecasts",
    icon: TrendingUp,
    subsections: [
      {
        id: "forecasts-general",
        title: "General",
        icon: FileText,
        items: [],
      },
      {
        id: "forecasts-statistical-methods",
        title: "Statistical Methods",
        icon: BarChart3,
        items: [],
      },
      {
        id: "forecasts-options",
        title: "Options",
        icon: ClipboardList,
        items: [],
      },
    ],
  },
  {
    id: "project-evaluation",
    title: "Project Evaluation",
    icon: Calculator,
    subsections: [
      {
        id: "project-evaluation-general",
        title: "General",
        icon: FileText,
        items: [],
      },
      {
        id: "project-evaluation-inputs",
        title: "Inputs",
        icon: FolderInput,
        items: [],
      },
      {
        id: "project-evaluation-outputs",
        title: "Outputs",
        icon: FolderOutput,
        items: [],
      },
    ],
  },
];

// Helper function to get all items for a section
export const getSectionItems = (sectionId) => {
  const section = faqData.find((s) => s.id === sectionId);
  if (!section) return [];

  // Special case for Financial Dashboard - show 6 cards
  if (sectionId === "financial-dashboard") {
    return [
      // Overview subsection
      {
        id: "financial-dashboard-overview",
        title: "Overview",
        icon: LayoutDashboard,
      },
      // Financial Statements subsection
      {
        id: "financial-dashboard-statements",
        title: "Financial Statements",
        icon: FileText,
      },
      // Financial Health subsection
      {
        id: "financial-dashboard-health",
        title: "Financial Health",
        icon: Gauge,
      },
      // Productivity section
      {
        id: "productivity",
        title: "Productivity",
        icon: Factory,
      },
      // Forecasts section
      {
        id: "forecasts",
        title: "Forecasts",
        icon: TrendingUp,
      },
      // Project Evaluation section
      {
        id: "project-evaluation",
        title: "Project Evaluation",
        icon: Calculator,
      },
    ];
  }

  const items = [];

  section.subsections.forEach((subsection) => {
    if (subsection.items && subsection.items.length > 0) {
      items.push(...subsection.items);
    } else {
      // If subsection has no items, treat the subsection itself as an item
      items.push({
        id: subsection.id,
        title: subsection.title,
        icon: subsection.icon,
      });
    }
  });

  return items;
};

// Helper function to get subsection items
export const getSubsectionItems = (sectionId, subsectionId) => {
  const section = faqData.find((s) => s.id === sectionId);
  if (!section) return [];

  const subsection = section.subsections.find((ss) => ss.id === subsectionId);
  if (!subsection) return [];

  if (subsection.items && subsection.items.length > 0) {
    return subsection.items;
  } else {
    // Return the subsection itself as a single item
    return [
      {
        id: subsection.id,
        title: subsection.title,
        icon: subsection.icon,
      },
    ];
  }
};

// Helper function to find a specific FAQ item
export const findFAQItem = (itemId) => {
  // Check if it's a section
  for (const section of faqData) {
    if (section.id === itemId) {
      return {
        id: section.id,
        title: section.title,
        icon: section.icon,
        sectionId: section.id,
        sectionTitle: section.title,
      };
    }

    // Check if it's a subsection
    for (const subsection of section.subsections) {
      if (subsection.id === itemId) {
        return {
          id: subsection.id,
          title: subsection.title,
          icon: subsection.icon,
          sectionId: section.id,
          sectionTitle: section.title,
          subsectionId: subsection.id,
          subsectionTitle: subsection.title,
        };
      }
      // Check if it's an item within a subsection
      if (subsection.items) {
        for (const item of subsection.items) {
          if (item.id === itemId) {
            return {
              ...item,
              sectionId: section.id,
              sectionTitle: section.title,
              subsectionId: subsection.id,
              subsectionTitle: subsection.title,
            };
          }
        }
      }
    }
  }
  return null;
};
