Consolidation of behavior and best practices for implementing controllers in express-resource.

You may want a lighter-weight controller.  The goal here is to be as lightweight as possible while
still supporting:
  * DRY URL and view helpers
  * Database / database model access
  * Others as necessary.

Some things are better supported in middleware.  While this is a work in progress, it is my intention
to use custom middleware as often as appropriate to keep this lean.  The test for this will be a moving target,
let's discuss.
