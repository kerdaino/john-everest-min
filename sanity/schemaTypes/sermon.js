export default {
  name: 'sermon',
  title: 'Sermon',
  type: 'document',

  fields: [
    {
      name: 'title',
      title: 'Sermon Title',
      type: 'string',
      validation: Rule => Rule.required()
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      }
    },

    {
      name: 'type',
      title: 'Sermon Type',
      type: 'string',
      options: {
        list: [
          { title: 'Write-Up', value: 'writeup' },
          { title: 'Video', value: 'video' },
          { title: 'External Link', value: 'link' },
          { title: 'Quote', value: 'quote' }
        ],
        layout: 'radio'
      }
    },

    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Teaching', value: 'teaching' },
          { title: 'Prayer', value: 'prayer' },
          { title: 'Revival', value: 'revival' },
          { title: 'Doctrine', value: 'doctrine' },
          { title: 'Prophetic', value: 'prophetic' }
        ]
      }
    },

    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true }
    },

    {
      name: 'scripture',
      title: 'Scripture Reference',
      type: 'string'
    },

    {
      name: 'body',
      title: 'Sermon Write-up',
      type: 'blockContent',
      hidden: ({ document }) => document?.type !== 'writeup'
    },

    {
      name: 'videoUrl',
      title: 'YouTube / Facebook Video URL',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'video'
    },

    {
      name: 'externalLink',
      title: 'External Sermon Link',
      type: 'url',
      hidden: ({ document }) => document?.type !== 'link'
    },

    {
      name: 'quote',
      title: 'Quote Text',
      type: 'text',
      rows: 4,
      hidden: ({ document }) => document?.type !== 'quote'
    },

    {
      name: 'publishedAt',
      title: 'Publish Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    },

    {
  name: 'audio',
  title: 'Audio File',
  type: 'file',
  options: {
    accept: 'audio/*'
  }
}
  ]
};
