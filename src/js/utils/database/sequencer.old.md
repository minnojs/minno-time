# Garbage collection

### Making your questionnaire dynamic
There are several ways that you can make your questionnaire more dynamic. We will give a short overview and then get into the specifics.

The basic elements of the player (pages or questions) are set into ordered lists (arrays). The player parses these lists into the questionnaire that the user eventually sees.

The first level of parsing has to do with the order that the elements appear.The [mixer](#mixer) allows you to control the order of the lists; it allows you to randomize the order, duplicate elements and even display them conditionally.

The second level of parsing has to do with inheritance. Many times you want to present several elements that share some of the same features (for instance, you may want all your pages to have the same header or the same submit text). The [inherit ](#inheritance) feature allows you to create prototypes of elements that you may reuse thought your script.

The third and last level of parsing has to do with templates. [Templates](#templates) allow you to change the settings of your elements depending on existing data from within the player. For instance, you may want to refer to the answer of a previous question. 

Some sequence may be parsed more than once, for instance, the questions sequences get re-parsed each time a response is changed, and each time a user returns to a page it is re-parsed. By default, none of the parsing is repeated so that the questionnaires can stay fixed. For each type of parsing there is a property that lets the player know that you want it re-parsed.

In order to re-parse mixers, set `remix` to true. In order to re-parse inheritance set `reinflate` to true. In order to re-parse templates set `regenerateTemplate` to true.

Another consideration when creating complex sequnces is logging. By default the player logs user responses automaticaly as soon as the user submits. If you are creating a sequence that allows users to go back to previous questions etc. you should make sure you don't prematurely log the user response (use `nolog`. learn more [here](#logger)).

### variables
**PIQuest** task objects have a reserved property called `questions`. `questions` holds an object that keeps track of all questions answered throughout the questionnaire. Each question is logged on to the property with its name; for instance if you have a question named quest1, then `questions.quest1` will hold an object describing the user response.
The following is a list of the response object properties:

Property            | Description
------------------- | --------------
response            | The user response itself.
latency             | The time from the moment the question was displayed to the last time it was changed.
pristineLatency     | The time from the moment the question was displayed to the first time it was changed.
declined            | whether the user declined to answer this question.

Throughout the player there are several components that refer to environmental variables. In particular you should check out [mixer conditions](#conditions) and [templates](#templates).


### templates??

Variable    | Description
----------- | -------------
global      | The global object.
current     | The current task object.
questions   | The questions object.
pagesData   | The 'data' attribute from the page.
questionsData   | The 'data' attribute from the question (available only within questions).
pagesMeta   | An object describing meta data about the page:</br> `number`: the serial number of this page, `outOf` the overall number of pages, `name`: the name of the current page. These can be used for instance to generate a description of your place within the questionnaire: `<%= pagesMeta.number %> out of <%= pagesMeta.outOf%>`.

Questions and Pages have access to the same local variables, with the exception of questionsData that is available only to questions.
