package expense.record.repository;

import expense.record.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	/**
	 * Obtiene los gastos de forma paginada.
	 *
	 * @param pageable configuración de paginación
	 * @return página de gastos
	 */
	Page<Expense> findAll(Pageable pageable);

	/**
	 * Calcula la suma de costos en un rango de fechas.
	 *
	 * @param fechaInicio fecha inicial del rango
	 * @param fechaFin fecha final del rango
	 * @return suma total de costos; si no hay resultados devuelve cero
	 */
	@Query("select coalesce(sum(e.cost), 0) from Expense e where e.date between :fechaInicio and :fechaFin")
	Double sumarCostosEntreFechas(@Param("fechaInicio") LocalDate fechaInicio,
								  @Param("fechaFin") LocalDate fechaFin);

	/**
	 * Calcula el promedio de costos en un rango de fechas.
	 *
	 * @param fechaInicio fecha inicial del rango
	 * @param fechaFin fecha final del rango
	 * @return promedio de costos; si no hay resultados devuelve cero
	 */
	@Query("select coalesce(avg(e.cost), 0) from Expense e where e.date between :fechaInicio and :fechaFin")
	Double promedioCostosEntreFechas(@Param("fechaInicio") LocalDate fechaInicio,
									 @Param("fechaFin") LocalDate fechaFin);

}
