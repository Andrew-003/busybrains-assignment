package com.busybrains.assignment.dto;

public record UserProfileResponse(
    Long id,
    String username,
    String email,
    String role
) {}
