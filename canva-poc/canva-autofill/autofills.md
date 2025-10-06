# Autofill

The Canva Connect APIs for working with autofillable brand templates.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use the Autofill APIs, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

The Autofill APIs let you create personalized designs using a brand template and input data. You can generate personalized invites, letters, training materials, pitch decks, marketing content, and more.

To get started with autofilled designs, add one or more autofillable data fields to a brand template using the Canva **Data autofill** app. For help on setting up an autofillable brand template, see the [Autofill guide](https://www.canva.dev/docs/connect/autofill-guide#create-an-autofillable-template).

To autofill the brand template:

1. Use the [Get brand template dataset API](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset) to check which fields you can fill and what kind of data you can use.
2. Use the [Create design autofill job API](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job) to provide the data you want autofilled and start generating the design (asynchronously).
3. Use the [Get design autofill job API](https://www.canva.dev/docs/connect/api-reference/autofills/get-design-autofill-job) to check the status of the autofill job and retrieve the design.

## Autofill APIs

* [Get brand template dataset](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset): Check if a brand template has autofillable fields and what type of information the fields accept.
* [Create design autofill job](https://www.canva.dev/docs/connect/api-reference/autofills/create-design-autofill-job): Create an asynchronous job to generate a design from a brand template with your provided field information.
* [Get design autofill job](https://www.canva.dev/docs/connect/api-reference/autofills/get-design-autofill-job): Get the status and results of the autofill job, including the autofilled design.
