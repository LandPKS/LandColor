## GitHub Heirarchy Documentation

For this project we will collaborate on our main master branch. However, all personal work will be merged with our own personal branches (denoted by our first names: i.e.- "steve", "christina", etc...)
Before one starts on any changes to any component, they should merge master with their own branch to insure the latest code is on their machine. Proper communication will also play key to this role.

*Be sure to Checkout before developing!*

Once changes have been made. Request a pull request through github.com portal.
We are all owners of the repository, therefore all have the rights to accept the pull request. Check to see if there are any merge conflicts before accepting merge. 

If you are unsure about conflicts, push to your own branch and we can review as a team.


# To merge master with your own branch
```bash
git checkout master
git pull
git checkout <your_branch_name>
git merge master
```

# To push your own branch after changes have been made
```bash
git add *
git commit -am "Change message"
git push -u origin <branch_name>>
```

