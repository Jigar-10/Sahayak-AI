package com.sahayakai.service;

import com.sahayakai.dto.EmergencyNumberDto;
import com.sahayakai.exception.ResourceNotFoundException;
import com.sahayakai.model.EmergencyNumber;
import com.sahayakai.repository.EmergencyNumberRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class EmergencyNumberService {

    private final EmergencyNumberRepository repository;

    public EmergencyNumberService(EmergencyNumberRepository repository) {
        this.repository = repository;
    }

    public List<EmergencyNumber> getAllActive() {
        return repository.findByActiveTrueOrderByIsPrimaryDescNameAsc();
    }

    public EmergencyNumber getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency number not found with ID: " + id));
    }

    public EmergencyNumber create(EmergencyNumberDto dto) {
        EmergencyNumber number = new EmergencyNumber();
        number.setId(dto.getId() != null ? dto.getId() : dto.getNumber());
        number.setName(dto.getName());
        number.setNumber(dto.getNumber());
        number.setDescription(dto.getDescription());
        number.setCategory(dto.getCategory());
        number.setState(dto.getState() != null ? dto.getState() : "All India");
        number.setAvailable24x7(dto.isAvailable24x7());
        number.setActive(true);
        number.setPrimary(dto.isPrimary());
        number.setIconName(dto.getIconName() != null ? dto.getIconName() : "Phone");
        number.setAvailability(dto.getAvailability() != null ? dto.getAvailability() : "Available 24/7");
        number.setCreatedAt(Instant.now());
        number.setUpdatedAt(Instant.now());

        return repository.save(number);
    }

    public EmergencyNumber update(String id, EmergencyNumberDto dto) {
        EmergencyNumber existing = getById(id);
        existing.setName(dto.getName());
        existing.setNumber(dto.getNumber());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setState(dto.getState());
        existing.setAvailable24x7(dto.isAvailable24x7());
        existing.setActive(dto.isActive());
        existing.setPrimary(dto.isPrimary());
        if (dto.getIconName() != null) existing.setIconName(dto.getIconName());
        if (dto.getAvailability() != null) existing.setAvailability(dto.getAvailability());
        existing.setUpdatedAt(Instant.now());

        return repository.save(existing);
    }

    public void delete(String id) {
        EmergencyNumber existing = getById(id);
        repository.delete(existing);
    }
}
