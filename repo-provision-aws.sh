
# http://0.0.0.0:8060
# seed "my_seed_000000000000000000007777"
# dev 8070 port
# endpoint, seed, wallet info needs to be as variables

aca-py provision \
--endpoint http://3.141.51.96:8070 \
--genesis-file "/home/jte/git/vsw-repo/app/resources/genesis.txt" \
--wallet-type indy \
--wallet-name Repo.Agent \
--wallet-key Repo.Agent \
--seed my_seed_000000000000000000007777