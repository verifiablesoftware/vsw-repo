# Verifiable Software

This project consists of the code for running a verifiable software repo. For
details about the verifiable software ecosystem, see
[vsw](https://github.com/verifiablesoftware/vsw) which contains the `vsw`
command line tool.


build image: docker build -t vsw-repo .
run container: docker run -d --name vsw-repo -p 8000:8000 vsw-repo

or run from the shell script

chmod +x start.sh
./start.sh