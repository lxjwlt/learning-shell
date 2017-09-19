# find

**[Quiz]** how many *.(@random_suffix) file in (@random_path)?

**[Tip]** grep

**[Answer]** find -type f -name *.(@random_suffix) -o -name *.(@random_suffix) -o -name *.(@random_suffix) | wc -l
