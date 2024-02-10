package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.demo.model.Book; // Import the Book class from the appropriate package
import com.example.demo.repository.BookRepository;

import java.util.List;

@Controller
@RequestMapping("/main")
public class Maincontroller {
	
	  private final BookRepository bookRepository;

	    @Autowired
	    public Maincontroller(BookRepository bookRepository) {
	        this.bookRepository = bookRepository;
	    }


	 @PostMapping("/saveBooks")
	    @ResponseBody
	    public String saveBooks(@RequestBody List<Book> books) {
	        try {
	            bookRepository.saveAll(books);
	            System.out.println("Books saved successfully");
	            return "Books data saved successfully.";
	        } catch (Exception e) {
	            e.printStackTrace();
	            return "Failed to save books data.";
	        }
	    }

	 @GetMapping("/books")
	    public String getAllBooks(Model model) {
	        List<Book> books = bookRepository.findAll();
	        model.addAttribute("books", books);
	        System.out.println("Books retrieved successfully: " + books);
	        return "mainbooks"; // Assuming you have a view named "mainbooks.html" to display the list of books
	    }

	 

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @GetMapping("/sign")
    public String showSignForm(Model model) {
        return "sign";
    }

    @PostMapping("/signup")
    public String processSignup() {
        return "redirect:/Home";
    }

    @PostMapping("/login")
    public String login(String username, String password, Model model) {
        if ("name".equals(username) && "123".equals(password)) {
            model.addAttribute("message", "Login successful");
            return "Home";
        } else {
            model.addAttribute("error", "Invalid credentials");
            return "login";
        }
    }

    @GetMapping("/Home")
    public String home() {
        return "index";
    }

}

