package com.example.voting.system;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/vote")
public class Controller {
    private final AtomicInteger candidateA = new AtomicInteger(0);
    private final AtomicInteger candidateB = new AtomicInteger(0);

    private final ConcurrentHashMap<String, String> voters =  new ConcurrentHashMap<>();

    @GetMapping("/{id}")
    public int getCurrentVoteByCandId(@PathVariable String id) {

        id = id.trim();

        return switch (id) {
            case "A" -> candidateA.get();
            case "B" -> candidateB.get();
            default -> throw new IllegalStateException("Unexpected value: " + id);
        };
    }

    @PutMapping
    public ResponseEntity<?> castVoteByCandidateId(@RequestBody VoteRequest voteRequest) {

        if (voters.containsKey(voteRequest.citizenUUID())) {
            return ResponseEntity.badRequest().body("voter has already voted");
        }

        switch (voteRequest.candidateId()) {
            case "A" -> candidateA.incrementAndGet();
            case "B" -> candidateB.incrementAndGet();
            default -> throw new IllegalStateException("Unexpected value: " + voteRequest.candidateId());
        };

        voters.put(voteRequest.citizenUUID(), voteRequest.candidateId());
        return ResponseEntity.ok("vote has been successfully cast");
    }
}
