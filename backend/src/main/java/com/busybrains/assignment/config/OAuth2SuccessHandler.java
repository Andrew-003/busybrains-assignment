package com.busybrains.assignment.config;

import com.busybrains.assignment.model.User;
import com.busybrains.assignment.repository.UserRepository;
import com.busybrains.assignment.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    
    @org.springframework.beans.factory.annotation.Value("${frontend.url}")
    private String frontendUrl;
    
    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request, 
            HttpServletResponse response, 
            Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");
        
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(name != null ? name.replaceAll("\\s+", "").toLowerCase() : email);
            newUser.setEmail(email);
            newUser.setRole("USER");
            newUser.setPassword("OAUTH2_USER_NO_PASSWORD"); // Dummy password for OAuth2 users
            return userRepository.save(newUser);
        });
        
        // Update username for existing OAuth2 users if it's still email
        if (user.getUsername().equals(user.getEmail()) && name != null) {
            user.setUsername(name.replaceAll("\\s+", "").toLowerCase());
            userRepository.save(user);
        }
        
        String token = jwtService.generateToken(user);
        
        // Redirect to frontend with token
        response.sendRedirect(frontendUrl + "/oauth2/success?token=" + token);
    }
}
