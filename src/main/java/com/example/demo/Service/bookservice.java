package com.example.demo.Service;

import com.example.demo.model.Book;
import com.example.demo.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class bookservice {

    private final BookRepository bookRepository;

    @Autowired
    public bookservice(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    // Other CRUD operations as needed
    
    public void deleteBookById(Long id) {
        bookRepository.deleteById(id);
    }

}
