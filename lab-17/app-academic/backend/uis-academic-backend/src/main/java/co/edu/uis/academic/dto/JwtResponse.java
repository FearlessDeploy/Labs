package co.edu.uis.academic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String name;
    private String role;
}