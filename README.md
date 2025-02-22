# in-memory-voting-system

Super simple in memory voting system using Java with spring boot.
I set up this project to test out k6 load testing tool. 

# How to run:
```
# Need to have Java 23+

# if on mac:
./mvnw spring-boot:run

# if on windows:
mvnw.cmd spring-boot:run


^ Now you'll have the api up and running on port 8080
```

# API Routes:
- GET "A" candidate current vote count -> `curl --location 'localhost:8080/vote/A'`
- GET "B" candidate current vote count -> `curl --location 'localhost:8080/vote/B'`
- PUT a vote by a citizen: (citizenUUID needs to be unique for each call, and you can have B or A for candidateId)
```
curl --location --request PUT 'localhost:8080/vote' \
--header 'Content-Type: application/json' \
--data '{
    "citizenUUID":"1234",
    "candidateId":"A"
}'
```

# Running the load test for K6:

Install k6: https://k6.io/open-source/
```
# on a mac:
brew install k6
```

With the api up and running on port 8080, we can run the load test:
```
# run this for default options
k6 run test.js

# or make the duration loger by running with duration flag
k6 run --duration 2m test.js
```

You should see an output similar to:
```
     checks.........................: 100.00% 2565158 out of 2565158
     data_received..................: 161 MB  5.4 MB/s
     data_sent......................: 110 MB  3.7 MB/s
     http_req_blocked...............: avg=53.95µs  min=0s      med=0s       max=6.71s   p(90)=1µs     p(95)=1µs
     http_req_connecting............: avg=53.24µs  min=0s      med=0s       max=6.71s   p(90)=0s      p(95)=0s
     http_req_duration..............: avg=160.74µs min=40µs    med=146µs    max=56.36ms p(90)=222µs   p(95)=266µs
       { expected_response:true }...: avg=160.74µs min=40µs    med=146µs    max=56.36ms p(90)=222µs   p(95)=266µs
     http_req_failed................: 0.00%   0 out of 1282579
     http_req_receiving.............: avg=7.43µs   min=2µs     med=4µs      max=41.1ms  p(90)=13µs    p(95)=23µs
     http_req_sending...............: avg=1.63µs   min=-8000ns med=1µs      max=4.85ms  p(90)=2µs     p(95)=2µs
     http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s      p(90)=0s      p(95)=0s
     http_req_waiting...............: avg=151.67µs min=34µs    med=139µs    max=56.01ms p(90)=213µs   p(95)=254µs
     http_reqs......................: 1282579 42752.16876/s
     iteration_duration.............: avg=231.4µs  min=52.12µs med=161.33µs max=6.71s   p(90)=245.7µs p(95)=299.29µs
     iterations.....................: 1282579 42752.16876/s
     vus............................: 10      min=10                 max=10
     vus_max........................: 10      min=10                 max=10

```
The result metrics that interest me are:

```
 http_req_failed................: 0.00%   0 out of 1282579 (meaning none failed!!)
 
 # this tells you the avg latency of each req, with p95, and P90, and max
 http_req_duration..............: avg=160.74µs min=40µs    med=146µs    max=56.36ms p(90)=222µs   p(95)=266µs
 
 # throughput:
 http_reqs......................: 1282579 42752.16876/s
```



