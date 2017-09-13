# ls

## List files

**[Quiz]** List all files (include | exclude) hidden files under (current | @random_path() | multi) directory

**[Tip]** `man ls`

**[Answer]** ls (-a) (@random_path() | multi)

<hr/>

**[Quiz]** is there (@random_name() | @random_type()) file under (current | @random_path() | multi) directory?

**[Tip]** `man ls`

**[Answer]** (y | n)

<hr/>

**[Quiz]** List only directories (includes hidden directory) under (current | @random_path() | multi) directory?

**[Tip]** `ls -d ?`

**[Answer]** ls -d (current | @random_path() | multi)\*/ (.\*/)


## permissions

**[Quiz]** is (@random_path()) a directory or file?

**[Tip]** `man ls`

**[Answer]** ls -ld (@random_path())

<hr/>

**[Quiz]** can (you | @random_user() | @random_group()) (read | write | execute) (@random_path())?

**[Tip]** `man ls`

**[Answer]** ls -ld (@random_path())

## Size

**[Quiz]** how much size of (@random_path())?

**[Tip]** `man ls`

**[Answer]** ls -ldh (@random_path())
