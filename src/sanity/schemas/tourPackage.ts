// ============================================
// TOUR PACKAGE SCHEMA
// ============================================
// Represents a travel destination/tour package

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'tourPackage',
  title: 'Tour Package',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the destination (e.g., "Kyoto", "Santorini")',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for the tour',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      description: 'Primary image for the tour package',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility',
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Country or region (e.g., "Japan", "Greece")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      description: 'Display price (e.g., "$1,299")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'Trip duration (e.g., "7 Days", "2 Weeks")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Average rating (1-5)',
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      description: 'Total number of reviews',
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Easy', value: 'easy' },
          { title: 'Moderate', value: 'moderate' },
          { title: 'Challenging', value: 'challenging' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description for cards (max 200 characters)',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed description with rich text formatting',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key highlights of the tour',
    }),
    defineField({
      name: 'includes',
      title: 'What\'s Included',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'excludes',
      title: 'What\'s Not Included',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'itinerary',
      title: 'Itinerary',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'day', type: 'number', title: 'Day' },
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description' },
            {
              name: 'activities',
              type: 'array',
              of: [{ type: 'string' }],
              title: 'Activities',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this tour prominently on the homepage',
      initialValue: false,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Trekking', value: 'trekking' },
          { title: 'Culture', value: 'culture' },
          { title: 'Beaches', value: 'beaches' },
          { title: 'Mountains', value: 'mountains' },
          { title: 'Adventure', value: 'adventure' },
          { title: 'Relaxation', value: 'relaxation' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      media: 'mainImage',
      price: 'price',
    },
    prepare({ title, location, media, price }) {
      return {
        title,
        subtitle: `${location} - ${price}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Featured First',
      name: 'featuredDesc',
      by: [{ field: 'featured', direction: 'desc' }],
    },
    {
      title: 'Price (Low to High)',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
  ],
});
