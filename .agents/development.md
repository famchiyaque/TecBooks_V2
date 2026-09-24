## Agentic Coding Development

Since we are working as a team on this project where the vast majority of the code is AI-produced, it's important that our agents work in a similar fashion to avoid conflicting patterns, mismatching architectures, and inconsistent folder structure. 

That's why we've implemented this `.agents` folder, albeit a bit late. We have already injected a lot of technical debt in the aforementioned ways which permanece because we are on a tight deadline to deliver functionalities. 

In order to mitigate further techincal debt, we will be recording and organizing important this technical debt and coding patterns so that we can build in a more sustainable way until we get the chance to formally restructure using AI as well.

### Rules

- whenever a feature requires a coding pattern- i.e. MVC backend, api/hook/page in frontend, client storage or optimized query caching- look in our `./patterns.md` file first to see if a prexisting pattern can be utilized
- in the absence of a pre-existing pattern, record it in the `./patterns.md` file
- when finding an outdated pattern in the codebase, record it in the `./technical-debt.md` file
- when finding an outdated pattern in our codebase during a feature implementation, prompt the user whether to refactor with the correct pattern or not. If the user decides against, record it. If they do proceed with the refactor, record that instance of tecnical debt as well.
