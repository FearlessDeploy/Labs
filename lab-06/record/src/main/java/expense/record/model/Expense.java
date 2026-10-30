package expense.record.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "expense")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 255)
    String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "expense", nullable = false)
    private Double cost;

    public Expense(){}

    // Getter
    public Long getId(){return this.id;}
    public String getTitle(){return this.title;}
    public String getDescription(){return this.description;}
    public LocalDate getDate(){return this.date;}
    public Double getCost(){return this.cost;}

    // Setter
    public void setTitle(String title){ this.title = title;}
    public void setDescription(String description){this.description = description;}
    public void setDate(LocalDate date){this.date = date;}
    public void setCost(Double cost){this.cost = cost;}
}
