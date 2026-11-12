package com.skilltest.controller;

import com.skilltest.model.Bookmark;
import com.skilltest.service.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    public ResponseEntity<List<Bookmark>> getBookmarks(@RequestParam Long studentId) {
        return ResponseEntity.ok(bookmarkService.getBookmarks(studentId));
    }

    @PostMapping
    public ResponseEntity<Bookmark> addBookmark(@RequestBody Map<String, Object> req) {
        Long studentId = Long.valueOf(req.get("studentId").toString());
        String questionId = req.get("questionId").toString();
        String notes = req.get("notes") != null ? req.get("notes").toString() : null;

        Bookmark bookmark = bookmarkService.addBookmark(studentId, questionId, notes);
        return new ResponseEntity<>(bookmark, HttpStatus.CREATED);
    }

    @DeleteMapping("/{questionId}")
    public ResponseEntity<Map<String, Object>> removeBookmark(@PathVariable String questionId, @RequestParam Long studentId) {
        bookmarkService.removeBookmark(studentId, questionId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Bookmark removed"));
    }
}

