package com.example.sportter.repository;

import com.example.sportter.model.Publicacion;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublicacionRepository extends JpaRepository<Publicacion, Long> {
    
	 @EntityGraph(
		        type = EntityGraph.EntityGraphType.FETCH,
		        attributePaths = {"usuario", "categoriaDeporte"}
		    )
		    @Query("SELECT DISTINCT p FROM Publicacion p LEFT JOIN FETCH p.usuario LEFT JOIN FETCH p.categoriaDeporte ORDER BY p.fechaHora DESC")
		    List<Publicacion> findAllWithUserAndCategory();
}