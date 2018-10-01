# The DLx Data Format

## Introduction

This project aims to create a standardized, human-readable, web-compatible format for storing linguistic data, following best practices for managing data on the modern web. It is part of a broader project called Digital Linguistics (DLx), which has the goal of creating web tools for managing linguistic data. This project will be useful for anyone who manages a linguistic database.

This repository contains the specification for the Data Format for Digital Linguistics (abbreviated as DaFoDiL, i.e. Daffodil). This specification is a recommendation for how to store linguistic data in a way that is standardized, human-readable and web-compatible, using a popular data storage format on the web known as [JSON][23].

Tools which follow this recommended format will be interoperable, allowing users to migrate their data easily from one tool to another. In addition, this format is compatible with the modern web platform, making it easy to manage linguistic data online or in a browser. All Digital Linguistics projects utilize this data format.

This format also facilitates adherence to the [Austin Principles for Data Citation in Linguistics][22] by supporting the use of persistent identifiers, fields for identifying contributors to the data and their role(s), easy searchability, human-readability (in the form of human-readable keys in addition to opaque database IDs), and interoperability between different tools and web technologies more generally.

Please consider citing this specification in scholarly articles using this repository's [Zenodo][6] DOI:

> Hieber, Daniel W. 2018. _Data Format for Digital Linguistics_. DOI:[10.5281/zenodo.1438589][5]

![npm downloads](https://img.shields.io/npm/dt/@digitallinguistics/spec.svg)
[![DOI](https://zenodo.org/badge/50221632.svg)](https://zenodo.org/badge/latestdoi/50221632)
![license](https://img.shields.io/github/license/digitallinguistics/spec.svg)

## Contents & Quick Links

* [About the Format](#about-the-format): learn what the DLx format is and how it works

* [Schemas](#schemas): read the schemas and get started using the DLx format in your own projects

* [Bugs & Feature Requests][20]: Need to report a bug or suggest a feature? [Open an issue on GitHub][21]. Check out the [contributing guidelines][18] for information on the best way to report a bug or request a feature.

* [Contributing][18]: Want to contribute to this project? :star2: Awesome! :star2: [Check out the contributing guidelines to get started][18].

## About the DLx Format

The canonical way that linguists represent linguistic data in their publications is with an [interlinear gloss][4]. This is typically a 3- or 4-line format that shows a phrase in the language of interest, the words and morphemes inside the phrase, what each of those morphemes means, and its overall translation. Here is a short example of an interlinear gloss for a phrase in a language called Chitimacha:

```
Wetkx hus naancaakamankx weyt hi hokmiqi.                      (Transcription)
wetkx   hus   naancaaka-mank-x   weyt   hi      hok-mi-qi      (Morpheme Breakdown)
then    his   brother-PL-TOP     he     there   leave-PL-3sg   (Glosses)
'Then he left his brothers there.'                             (Translation)
```

While humans look at a representation like this and can see which glosses are associated with which morphemes, computers cannot rely on visual layouts in this way, and require more explicit structure. The purpose of the Digital Linguistics data format is to define a standard for representing interlinear glosses (as well as other linguistic information, such as dictionary entries) in a digital, computer-readable way.

There are many ways a linguist could choose to represent their data in digital form. Not only are many formats are available (a relational database, XML, a tabular spreadsheet, JSON, etc.), but there is significant flexibility in deciding what properties to include in your data and what to call them. For example, does the data about a text have a property specifying the language it was spoken in, and should that property be represented as `"lang"` or `"language"`?

The Digital Linguistics (DLx) project recommends a data format called [**JSON**][23] (JavaScript Object Notation) for digitally representing your linguistic data. Moreover, the DLx project has drafted recommendations for how to structure linguistic data using JSON. This recommended format was designed to capture hierarchical linguistic data in a way that aligns with the descriptive categories that linguists actually use, relying on fundamental linguistic notions such as *text*, *morpheme*, *orthography*, etc. For instance, this format is capable of capturing the fact that a text contains sentences, sentences contain words, words contains morphemes, and morphemes contain phonemes. This functionality turns out to be a crucial factor in inputting, editing, searching, and analyzing linguistic data. At the same time, the DLx format is computer-readable, easily searchable, and is natively supported by all modern web-based tools.

The DLx project recommends JSON because it has become the data interchange format for the modern web, and is natively supported by every major programming language. This makes it significantly easier for programmers to develop tools that use the DLx format, meaning that linguists will have a wider variety of options and helpful tools for managing their linguistic data. Moreover, JSON is extremely easy for humans to read. Below is a short phrase represented in JSON. Notice that, even if you don't understand how the format works, you can see the hierarchical relationship between the sentence, its words, and their morphemes, and you know which piece of data belongs to what kind of linguistic object.

```json
{
  "transcription": {
    "spa": "hola me llamo Daniel",
    "ipa": "ola me jamo dænjəl"
  },
  "translation": {
    "eng": "Hello, my name is Daniel.",
  },
  "words": [
    {
      "transcription": {
        "spa": "hola",
        "ipa": "ola"
      },
      "translation": {
        "eng": "hello"
      },
      "morphemes": [
        {
          "transcription": {
            "spa": "hola",
            "ipa": "ola"
          },
          "gloss": {
            "eng": "hello"
          }
        }
      ]
    },
    {
      "transcription": {
        "spa": "me",
        "ipa": "me"
      },
      "translation": {
        "eng": "me"
      },
      "morphemes": [
        {
          "transcription": {
            "spa": "me",
            "ipa": "me"
          },
          "gloss": {
            "eng": "1sg.DO"
          }
        }
      ]
    },
    {
      "transcription": {
        "spa": "llamo",
        "ipa": "jamo"
      },
      "translation": {
        "eng": "I call"
      },
      "morphemes": [
        {
          "transcription": {
            "spa": "llam",
            "ipa": "jam"
          },
          "gloss": {
            "eng": "call"
          }
        },
        {
          "transcription": {
            "spa": "o",
            "ipa": "o"
          },
          "gloss": {
            "eng": "1sg.PRES.IND.SUBJ"
          }
        }
      ]
    },
    {
      "transcription": {
        "spa": "Daniel",
        "ipa": "dænjəl"
      },
      "translation": {
        "eng": "Daniel"
      },
      "morphemes": [
        {
          "transcription": {
            "spa": "Daniel",
            "ipa": "dænjəl"
          },
          "gloss": {
            "eng": "Daniel"
          }
        }
      ]
    }
  ]
}
```

JSON format is easy to learn. It consists of just a few simple rules:

* All data in JSON is represented as either an Object, represented by curly braces `{ }`, or a Collection of Objects (also called an Array), represented by square brackets `[ ]`.

* Objects represent a single instance of a type of data. For instance, the example above is an Object that represents a single Sentence.

* Objects contain a list of properties (also called attributes or fields) and their values, both placed in double quotes `" "` and separated by a colon `:`. Pairs of properties and values are separated by commas `,`. In the example above, the Sentence has a property called `"transcription"`, and the value of that property is an Object containing transcriptions of the Sentence in different orthographies. For example, the `"spa"` property shows a transcription of the Sentence in standard Spanish orthography: `"Hola, me llamo Daniel."`.

* Arrays are a collection of Objects separated by commas `,`. The items in an Array can be strings of text (e.g. `"hola"`), numbers (with no quotes, e.g. `17`), Objects (e.g. `{ }`), or even other Arrays (e.g. `[ ]`). In the example above, the Sentence has a collection called `"words"` containing a list of all the words in the phrase. Notice each word in turn has its own collection, called `"morphemes"`. This nesting of Arrays and Objects allows us to capture the hierarchical nature of linguistic data.

Another great feature of JSON is that adding new properties to an Object doesn't change or in any way disrupt its other properties. This allows you to take your data from tool to tool without any tedious conversion or formatting. For example, say you've transcribed your data using a tool for morphological analysis, and now you want to add time alignment to each phrase using a different tool. If you were using FLEx and ELAN, you would have to first export from FLEx and create an ELAN file. In other words, you have to change the data *format* just to change the type of annotation you want to add. But with JSON, adding time alignment data couldn’t be simpler. The time alignment tool would merely add properties called `"startTime"` and `"endTime"` to the phrase, and enter their values. You could then take your data back to the morphological analysis tool without any converting. The data hasn't been altered, just extended. The underlying format is all the same.

## Schemas

### Linguistic Schemas
The DLx project provides recommendations for how to format linguistic data in JSON for the following kinds of linguistic objects. Click each object to see its specification. Note that working data does *not* need to adhere to these schemas. Only data stored or exchanged in JSON format must follow these specifications. Developers may choose to represent the data internally in their software however they wish.

* [Language](https://digitallinguistics.github.io/spec/schemas/Language.html)
* [Orthography](https://digitallinguistics.github.io/spec/schemas/Orthography.html)
* [Text](https://digitallinguistics.github.io/spec/schemas/Text.html)
* [Sentence](https://digitallinguistics.github.io/spec/schemas/Sentence.html)
* [Word](https://digitallinguistics.github.io/spec/schemas/Word.html)
* [Morpheme](https://digitallinguistics.github.io/spec/schemas/Morpheme.html)
* [Phoneme](https://digitallinguistics.github.io/spec/schemas/Phoneme.html)
* [Lexicon](https://digitallinguistics.github.io/spec/schemas/Lexicon.html)
* [Lexeme](https://digitallinguistics.github.io/spec/schemas/Lexeme.html)
* [Transcription](https://digitallinguistics.github.io/spec/schemas/Transcription.html)

### Non-Linguistic Schemas
Other non-linguistic objects are given specifications as well (click on the name of each to see its specification):

Schema                  | Description
----------------------- | -----------
[`Abbreviation`][1]     | A human-readable abbreviation, containing no spaces, and only letters A-Z or numbers.
[`Access`][2]           | Information about who should be allowed to access the current data. Access rights can be specified in many of the formats used by well-known linguistic archives such as ELAR or AILLA, or using a custom schema.
[`Address`][8]          | A postal address.
[`Bundle`][3]           | A collection of resources relating to a single event or task, such as all the files relating to a certain elicitation session, or all the field notes from a given day.
[`DateCreated`][10]     | The date a database resource was created (*not* the date the item was recorded).
[`DateModified`][11]    | The date a database resource was last modified.
[`DateRecorded`][12]    | The date a database resource (usually a text) was recorded.
[`LexemeReference`][13] | An Object that contains a reference to an item in a lexicon.
[`Location`][17]        | A location with optional geographic coordinates.
[`Media`][5]            | Information and metadata about a media file (e.g. WAV, PDF, or JPEG files, etc.).
[`MultiLangString`][14] | An Object containing a piece of text in multiple languages. Typically used for analyses (e.g. translations) rather than data in the language of study.
[`Note`][6]             | Most DLx resources allow you to add notes in different languages, of different types.
[`Person`][7]           | Information about a person, e.g. speaker, linguist, editor, translator, etc.
[`Reference`][15]       | A bibliographic reference.
[`Tags`][9]             | A collection of tags on the given resource. Particularly useful for tagging instances of a phenomenon in your corpora.
[`URL`][16]             | A URL.

### Using the Schemas
Following the recommended data format in your own project is as easy as making sure you include the required properties in your data, and format them in the recommended ways. For example, if you wish to create a JSON object representing a phrase, you should follow the Sentence schema by making sure you include the `transcription`, `translation`, and `words` properties on the JSON object. And if you want to include additional data, check to see whether there is already a recommended property you can use. For example, if you wish to indicate the time within the audio file that the phrase begins and ends, you would use the `startTime` and `endTime` properties, each of which is a number formatted in seconds and milliseconds (SS.MMM).

Note that most schemas have a strongly-recommended (but optional) `type` property indicating the schema that that object adheres to.

## Want to Contribute?

Check out the [Contributing Guidelines][18] for this project.

## Maintainers

This repository is maintained by [Daniel W. Hieber][19] ([@dwhieb][19]).

[1]:  https://digitallinguistics.github.io/spec/schemas/Abbreviation.html
[2]:  https://digitallinguistics.github.io/spec/schemas/Access.html
[3]:  https://digitallinguistics.github.io/spec/schemas/Bundle.html
[4]:  https://en.wikipedia.org/wiki/Interlinear_gloss
[5]:  https://digitallinguistics.github.io/spec/schemas/Media.html
[6]:  https://digitallinguistics.github.io/spec/schemas/Note.html
[7]:  https://digitallinguistics.github.io/spec/schemas/Person.html
[8]:  https://digitallinguistics.github.io/spec/schemas/Address.html
[9]:  https://digitallinguistics.github.io/spec/schemas/Tags.html
[10]: https://digitallinguistics.github.io/spec/schemas/DateCreated.html
[11]: https://digitallinguistics.github.io/spec/schemas/DateModified.html
[12]: https://digitallinguistics.github.io/spec/schemas/DateRecorded.html
[13]: https://digitallinguistics.github.io/spec/schemas/LexemeReference.html
[14]: https://digitallinguistics.github.io/spec/schemas/MultiLangString.html
[15]: https://digitallinguistics.github.io/spec/schemas/Reference.html
[16]: https://digitallinguistics.github.io/spec/schemas/URL.html
[17]: https://digitallinguistics.github.io/spec/schemas/Location.html
[18]: https://github.com/digitallinguistics/spec/blob/master/.github/CONTRIBUTING.md
[19]: https://github.com/dwhieb/
[20]: https://github.com/digitallinguistics/spec/blob/master/.github/CONTRIBUTING.md#reporting-bugs--other-issues
[21]: https://github.com/digitallinguistics/spec
[22]: http://site.uit.no/linguisticsdatacitation/
[23]: http://json.org/
[24]: http://site.uit.no/linguisticsdatacitation/austinprinciples/