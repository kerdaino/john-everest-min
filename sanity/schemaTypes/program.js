export default {
  name: "program",
  title: "Upcoming Program",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Program Title",
      type: "string",
      validation: Rule => Rule.required()
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" }
    },
    {
      name: "date",
      title: "Date",
      type: "datetime",
      validation: Rule => Rule.required()
    },
    {
      name: "venue",
      title: "Venue",
      type: "string"
    },
    {
      name: "image",
      title: "Program Flier",
      type: "image",
      options: { hotspot: true }
    },
    {
      name: "description",
      title: "Short Description",
      type: "text"
    },
    {
      name: "registrationLink",
      title: "Registration / More Info Link",
      type: "url"
    }
  ]
};
