---
title: Setting up a fresh development environment, part 2
date: "2018-05-08"
author: "Nicky Meuleman"
---

### installing Yarn

Lots of projects use the [Yarn](https://yarnpkg.com/) package manager.
To install it head to the [install section in their docs](https://yarnpkg.com/en/docs/install) and follow the instructions for you operating system.

I'm on Windows, so I downloaded the latest stable installer and ran it.
The reason I didn't install it through `npm` is because [they discourage it](https://yarnpkg.com/lang/en/docs/install/#install-via-npm)

Confirm the installation by checking the installed version

```bash
yarn --version
# 1.6.0
```

## More quality of life improvements

We can already do most of the things we want by this point.
What if we could do these things faster/easier/...

### Git

#### configuration

Let's start with the basics again and configure a few global settings.

```sh
git config --global user.name "Daniel Ricciardo"
git config --global user.email "john@doe.com"
```

You can look at your configuration like this:

```sh
git config --global --list
```

You can even look at and edit that configuration file (located at `~/.gitconfig`) using a text editor.

Did it ever look like someone changed every single line in a file, but when you looked closer at the files, you couldn't see any changes? This can happen when people are working on different operating systems.
Windows uses CRLF where Unix uses LF to signal the end of a line.
That is why we are going to configure the `autocrlf` setting

```sh
# for Windows:
git config --global core.autocrlf true
# for Linux/Mac
git config --global core.autocrlf input
```

When you do a `git pull` you are actually doing a `git fetch` and a `git merge`. This creates merge-commits that add no value to the repository.
We want to rebase on pull instead of merge, so `git pull --rebase`.
Luckily, there's a configuration option to do that automatically so you don't have to remember the --rebase part every time.

```sh
git config --global pull.rebase true
```

#### git aliases

You can configure a few git aliases to execute some commands you use often in a more convenient way.
The options are nearly limitless (and go beyond git itself).
Here is my favourite:

* git s to run git status in silent mode.
  The standard output you get from `git status` is very verbose. The output from silent mode is a lot cleaner!

```sh
git config --global alias.s "status -s"
```

![git status -s](./git-status-silent.gif)

up next: VSCode extensions!
