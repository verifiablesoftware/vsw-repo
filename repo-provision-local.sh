
# http://0.0.0.0:8060
# seed "my_seed_000000000000000000007777"

aca-py provision \
--endpoint http://0.0.0.0:8060 \
--genesis-file "/home/jte/git/vsw-repo/app/resources/genesis.txt" \
--wallet-type indy \
--wallet-name Repo.Local \
--wallet-key Repo.Local \
--seed my_seed_000000000000000000007777