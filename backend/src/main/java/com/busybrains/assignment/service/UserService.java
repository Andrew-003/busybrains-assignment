package com.busybrains.assignment.service;

import com.busybrains.assignment.dto.ChangePasswordRequest;
import com.busybrains.assignment.dto.LoginRequest;
import com.busybrains.assignment.dto.LoginResponse;
import com.busybrains.assignment.dto.RegisterRequest;
import com.busybrains.assignment.dto.UpdateProfileRequest;
import com.busybrains.assignment.dto.UserProfileResponse;
import com.busybrains.assignment.model.User;
import com.busybrains.assignment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }
    
    public User createUser(String username, String password, String email, String role) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        validatePassword(password);
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setRole(role);
        
        return userRepository.save(user);
    }
    
    public LoginResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.username())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(loginRequest.password(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }
        
        String token = jwtService.generateToken(user);
        
        return new LoginResponse(
            token, user.getId(), user.getUsername(),
            user.getEmail(), user.getRole()
        );
    }
    
    public LoginResponse register(RegisterRequest registerRequest) {
        User user = createUser(
            registerRequest.username(),
            registerRequest.password(),
            registerRequest.email(),
            "USER"
        );
        
        String token = jwtService.generateToken(user);
        
        return new LoginResponse(
            token, user.getId(), user.getUsername(),
            user.getEmail(), user.getRole()
        );
    }
    
    public Map<String, Object> getCurrentUserDetails(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("id", user.getId());
        userDetails.put("username", user.getUsername());
        userDetails.put("email", user.getEmail());
        userDetails.put("role", user.getRole());
        
        return userDetails;
    }
    
    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        return new UserProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
    
    public UserProfileResponse updateUserProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email already exists");
        }
        
        if (!user.getUsername().equals(request.username()) && userRepository.existsByUsername(request.username())) {
            throw new RuntimeException("Username already exists");
        }
        
        user.setUsername(request.username());
        user.setEmail(request.email());
        userRepository.save(user);
        
        return new UserProfileResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
    
    public void changeUserPassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password");
        }
        
        validatePassword(request.newPassword());
        
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }


    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password too short");
        }
        if (!password.matches(".*\\d.*")) {
            throw new RuntimeException("Password must contain numbers");
        }
    }
}
