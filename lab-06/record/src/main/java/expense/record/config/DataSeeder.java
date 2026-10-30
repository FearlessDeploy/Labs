package expense.record.config;

import expense.record.model.Expense;
import expense.record.repository.ExpenseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Carga datos iniciales en la base de datos H2 al iniciar la aplicación.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;

    public DataSeeder(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    /**
     * Inserta registros de ejemplo para facilitar pruebas manuales y de integración.
     *
     * @param args argumentos de arranque de la aplicación
     */
    @Override
    @Transactional
    public void run(String... args) {
        if (expenseRepository.count() > 0) {
            return;
        }

        expenseRepository.saveAll(List.of(
            createExpense("Compra supermercado semanal", "Alimentos y artículos básicos del hogar", LocalDate.of(2026, 8, 1), 85.50),
            createExpense("Pago transporte", "Tarjeta de metro y bus", LocalDate.of(2026, 8, 2), 24.00),
            createExpense("Cena con amigos", "Restaurante del centro", LocalDate.of(2026, 8, 2), 42.75),
            createExpense("Suscripción software", "Herramienta de productividad", LocalDate.of(2026, 8, 3), 19.99),
            createExpense("Combustible", "Tanque lleno del vehículo", LocalDate.of(2026, 8, 3), 63.20),
            createExpense("Pago internet", "Servicio mensual de internet en casa", LocalDate.of(2026, 8, 4), 35.90),
            createExpense("Farmacia", "Medicamentos y cuidado personal", LocalDate.of(2026, 8, 4), 18.40),
            createExpense("Almuerzo ejecutivo", "Comida de trabajo entre semana", LocalDate.of(2026, 8, 5), 27.50),
            createExpense("Cine", "Salida recreativa", LocalDate.of(2026, 8, 5), 16.00),
            createExpense("Luz y energía", "Factura mensual del apartamento", LocalDate.of(2026, 8, 6), 54.30),
            createExpense("Taxi nocturno", "Regreso a casa después de una reunión", LocalDate.of(2026, 8, 6), 12.80),
            createExpense("Compra librería", "Cuadernos y material de oficina", LocalDate.of(2026, 8, 7), 31.45),
            createExpense("Internet móvil", "Recarga de datos para el celular", LocalDate.of(2026, 8, 8), 10.00),
            createExpense("Mantenimiento vehículo", "Cambio de aceite y revisión", LocalDate.of(2026, 8, 9), 120.00),
            createExpense("Desayuno fuera", "Café y pan antes de ir al trabajo", LocalDate.of(2026, 8, 9), 8.75),
            createExpense("Donación", "Aporte solidario mensual", LocalDate.of(2026, 8, 10), 25.00),
            createExpense("Compra online", "Accesorios para el hogar", LocalDate.of(2026, 8, 10), 49.99)
        ));
    }

    /**
     * Construye una entidad de gasto con los datos recibidos.
     *
     * @param title título del gasto
     * @param description descripción del gasto
     * @param date fecha del gasto
     * @param cost costo del gasto
     * @return entidad lista para persistir
     */
    private Expense createExpense(String title, String description, LocalDate date, Double cost) {
        Expense expense = new Expense();
        expense.setTitle(title);
        expense.setDescription(description);
        expense.setDate(date);
        expense.setCost(cost);
        return expense;
    }
}