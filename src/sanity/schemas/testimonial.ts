// ============================================
// TESTIMONIAL SCHEMA
// ============================================
// Customer reviews and testimonials

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Full name of the reviewer',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'authorTitle',
      title: 'Author Title',
      type: 'string',
      description: 'Title or role (e.g., "Travel Enthusiast", "Solo Traveler")',
    }),
    defineField({
      name: 'authorAvatar',
      title: 'Author Avatar',
      type: 'image',
      description: 'Profile picture of the reviewer',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'authorLocation',
      title: 'Author Location',
      type: 'string',
      description: 'City and country (e.g., "Barcelona, Spain")',
    }),
    defineField({
      name: 'content',
      title: 'Testimonial Content',
      type: 'text',
      description: 'The actual review text',
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Star rating (1-5)',
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      options: {
        list: [
          { title: '⭐ 1 Star', value: 1 },
          { title: '⭐⭐ 2 Stars', value: 2 },
          { title: '⭐⭐⭐ 3 Stars', value: 3 },
          { title: '⭐⭐⭐⭐ 4 Stars', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5 Stars', value: 5 },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Review Date',
      type: 'date',
      description: 'When the review was written',
      options: {
        dateFormat: 'MMMM YYYY',
      },
    }),
    defineField({
      name: 'tourPackage',
      title: 'Related Tour Package',
      type: 'reference',
      to: [{ type: 'tourPackage' }],
      description: 'The tour this review is about (optional)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this testimonial on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'verified',
      title: 'Verified Purchase',
      type: 'boolean',
      description: 'Is this from a verified customer?',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'content',
      media: 'authorAvatar',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      const stars = '⭐'.repeat(rating || 0);
      return {
        title: `${title} ${stars}`,
        subtitle: subtitle?.substring(0, 60) + '...',
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Rating (High to Low)',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
});
