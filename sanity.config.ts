// ============================================
// SANITY STUDIO CONFIGURATION
// ============================================
// This file configures the embedded Sanity Studio

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';

// Define project configuration with validation
// Note: projectId must match /^[a-z0-9-]+$/ or Sanity SDK will crash
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const isValidProjectId = /^[a-z0-9-]+$/.test(rawProjectId) && rawProjectId.length > 0;
const projectId = isValidProjectId ? rawProjectId : 'not-configured';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  // Project identification
  name: 'itravel-studio',
  title: 'ITravel CMS',

  // Sanity project credentials
  projectId,
  dataset,

  // Base path for the embedded studio
  basePath: '/studio',

  // Plugins
  plugins: [
    // Structure tool for content management
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Tour Packages section
            S.listItem()
              .title('Tour Packages')
              .schemaType('tourPackage')
              .child(
                S.documentTypeList('tourPackage')
                  .title('Tour Packages')
              ),

            // Testimonials section
            S.listItem()
              .title('Testimonials')
              .schemaType('testimonial')
              .child(
                S.documentTypeList('testimonial')
                  .title('Testimonials')
              ),

            S.divider(),

            // Site Settings (Singletons)
            S.listItem()
              .title('Homepage Stats')
              .schemaType('homepageStats')
              .child(
                S.document()
                  .schemaType('homepageStats')
                  .documentId('homepageStats')
                  .title('Homepage Statistics')
              ),
          ]),
    }),

    // Vision tool for GROQ queries (development only)
    visionTool({
      defaultApiVersion: '2024-01-01',
    }),
  ],

  // Schema configuration
  schema: {
    types: schemaTypes,
  },

  // Studio theme customization
  studio: {
    components: {
      // You can add custom components here
    },
  },
});
