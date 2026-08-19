import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Home } from './pages/Home';
import { FrameworkPage } from './pages/FrameworkPage';
import { ThinkingPartnerPage } from './pages/ThinkingPartnerPage';
import { ToolkitPage } from './pages/ToolkitPage';
import { ToolDetailPage } from './pages/ToolDetailPage';
import { WorksheetsPage } from './pages/WorksheetsPage';
import { GamesPage } from './pages/GamesPage';
import { CaseStudiesPage } from './pages/CaseStudiesPage';
import { CaseStudyZenovocarePage } from './pages/CaseStudyZenovocarePage';
import { ResearchPage } from './pages/ResearchPage';
import { AboutPage } from './pages/AboutPage';
import { SpeculatePage } from './pages/SpeculatePage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true,                               Component: Home                    },
      { path: 'framework',                         Component: FrameworkPage           },
      { path: 'thinking-partner',                  Component: ThinkingPartnerPage     },
      { path: 'toolkit',                           Component: ToolkitPage             },
      { path: 'toolkit/:move/:toolSlug',           Component: ToolDetailPage          },
      { path: 'worksheets',                        Component: WorksheetsPage          },
      { path: 'games',                             Component: GamesPage               },
      { path: 'case-studies',                      Component: CaseStudiesPage         },
      { path: 'case-studies/zenovocare',           Component: CaseStudyZenovocarePage },
      { path: 'research',                          Component: ResearchPage            },
      { path: 'about',                             Component: AboutPage               },
      { path: 'speculate',                         Component: SpeculatePage           },
    ],
  },
], { basename: import.meta.env.BASE_URL });
