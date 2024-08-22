package com.salarix.domain.users.service;

import com.salarix.domain.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;

@Service
public class GenerateCodeEmployeeService {
    @Autowired
    private UserRepository userRepository;

    private static final DecimalFormat codeFormat = new DecimalFormat("000");

    public String generateCodeEmployee() {
        String lastCode = userRepository.findMaxCodeEmployee();
        if (lastCode == null) {
            return "001";
        }
        int nextCodeInt = Integer.parseInt(lastCode) + 1;
        return codeFormat.format(nextCodeInt);
    }

}
