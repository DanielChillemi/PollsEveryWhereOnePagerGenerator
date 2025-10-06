# Brand templates

The Canva Connect APIs for working with brand templates.

<Warning>
  Soon, all brand template IDs will be updated to a new format. If your integration stores brand template IDs, you'll need to migrate to use the new IDs. After we implement this change, you'll have 6 months to migrate before the old IDs are removed.
</Warning>

<Note>
  To use the brand templates APIs, your integration must act on behalf of a user that's a member of a [Canva Enterprise](https://www.canva.com/enterprise/) organization.
</Note>

Brand templates, part of [Canva Brand Kits](https://www.canva.com/pro/brand-kit/), let teams create branded templates to help them keep all their designs consistent and aligned to their brand.

The Brand template APIs allow you to work with a team's brand templates.

For more information on setting up a brand template, see [Canva Help — Publish designs as Brand Templates](https://www.canva.com/help/publish-team-template/)

## Brand template APIs

* [List brand templates](https://www.canva.dev/docs/connect/api-reference/brand-templates/list-brand-templates): List all the user's brand templates.
* [Get brand template](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template): Get the metadata for one of the user's brand templates.
* [Get brand template dataset](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset): Check if you can autofill a brand template and what information you can autofill. If the brand template has a dataset, you can autofill it with the [Autofill APIs](https://www.canva.dev/docs/connect/api-reference/autofills).
