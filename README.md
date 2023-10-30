The rh command is a command line tool that supports viewing and switching branches. It is written using the zx and sade libraries, and can be used to quickly switch between branches, along with iterm2's history, and the option to confirm with the down arrow key and enter. rh supports two command formats, view and back, where the view subcommand is for viewing, and the back subcommand is for going back to the branch being viewed. 

Of course, this is a very simple requirement, and one might argue that it wouldn't be better to just check it out with the graphical interface of source-tree or gitlen. Indeed, but the command line form allows me to quickly switch, with iterm2's history, select the down arrow key and enter to confirm, no need to go to the long timeline to find the commit, after switching the branch, but with the corresponding gitlen graphical interface more intuitive view of the change file.


-b specifies the branch reference, which stands for branch
-d is the branch direction, specifying whether to look forward or backward or to go back to the first commit.
The -b and -d options are required for the view subcommand.

```shell
$ rh view -b main -d first
$ rh view -b main -d next
$ rh view -b main -d prev
$ rh back
```
