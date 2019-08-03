---
title: How to unfork a repo on GitHub
date: '2019-08-03'
author: 'Nicky Meuleman'
cover: './cover.jpg'
tags: ['github', 'Howto', 'tutorial']
---

> TL;DR: **2 steps**: rename, import renamed under original name.

Sometimes a repository on GitHub started off as a fork.  
You now want to break that connection.

Forks on GitHub come with a few limitations, like not being able to have an issue tab.

![no issue tab](no-issue-tab.png)

## Rename your repository on GitHub

Go to the repository on GitHub, find the **Settings** page and rename your repository. (Don't worry, you'll get to keep the original name.)

![rename your repository on Github](rename.png)

This freshly renamed repository is still marked as a fork!

![repository marked as a fork](repo-marked-fork.png)

## Import the repository

GitHub provides a way to import repositories.

![import repository feature](import-repo.png)

Grab the link to clone the repository you just renamed and enter it.

> NOTE: Provide the https link, the SSH one won't work

For the name, enter the **original name** of your repository.
![import screen](import-with-original-name.png)

After a while the "new" repository will be ready.
If there is an e-mail address linked to that GitHub account, an e-mail will also notify you of success.

![Successfully imported the repository](completed-import.png)

## Enjoy your unforked repository

![unforked repository](unforked-repo.png)

The git history is still there.

The locally cloned project does not have to be touched.  
Pushing a change should work without intervention, since the remote url is the same as before.

What was lost in this process are the things specific to the GitHub web UI. For example: pull requests, a description, the provided website url.

![an empty header for a description and website](empty-description.png)
