---
title: Manipulate text like a boss
date: "2018-06-05"
author: "Nicky Meuleman"
cover: './cover.jpg'
---

<!-- Photo by dylan nolte on Unsplash -->

When listening to Syntax podcast [episode](https://syntax.fm/show/048/vs-code-round-two) on VSCode, using keyboard shortcuts came up.

When you spend a lot of time with text, moving around and manipulating that text can take up a small amount of time that adds up quickly.
Keyboard shorcuts go a long way in speeding up your text-related workflow.

I'm not advocating you ditch your mouse and become a [vim-wizard/witch](https://twitter.com/noopkat). Spend some time learning how to do operations you often repeat by using keyboard shortcuts instead of your mouse. The investment you make now will be paid back tenfold in no time.

## The basics

I was used to navigating text a single character at a time with the arrow keys. Keep the `ctrl` key pressed to affect words instead of characters.  
_I wish someone told me to get really comfortable with them when I started learning how to code._ These alone will save you so much time.

> Note: Mac users: substitute ctrl for command

* `ctrl+left` Move cursor to the beginning of the previous word.
* `ctrl+right` Move cursor to the beginning of the next word.
* `home` Move cursor to the beginning of the line.
* `end` Move cursor to the end of the line.
* `ctrl+home` Move cursor to the beginning of the file.
* `ctrl+end` Move cursor to the end of the file.
* `ctrl+backspace` Erase previous word.
* `ctrl+del` Erase next word.

Use `shift` to select while your cursor moves.

* `shift+left/right` Select character
* `shift+up/down` Move cursor line up/down and select everything in between
* `ctrl+shift+arrows` Select word
* `shift+home/end` Select till beginning/end of line

![basic](./basic.gif)

## Level up

You can use the shortcuts above nearly everywhere.
The next ones are more specific to the code editor.
I'm using VSCode (on Windows), but many of them are also available in other editors. You can view your keyboard shortcuts in VSCode by opening the command palette (`ctrl+shift+p`) and choosing "Preferences: open keyboard shortcuts"
Here you can search for and edit every keyboard shortcut for VSCode.

There is a treasure trove of useful one right here for [Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf), [Mac](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf) and [Linux](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf)
.

What follows are the ones I use frequently.

### Line bubbling

Moving/copying a line up or down. (sick name [@wesbos](https://twitter.com/wesbos))

* `alt+up/down` moves your current line.
* `shift+alt+up/down` duplicates your current line

> NOTE: You don't have to select the line for these to work.

![Line bubbling](line-bubbling.gif)

### Expand/shrink selection

Expand/shrink your selection to the next logical point

![expand/shrink selection](expand-shrink-selection.gif)
