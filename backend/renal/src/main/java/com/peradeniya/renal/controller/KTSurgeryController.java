package com.peradeniya.renal.controller;

import com.peradeniya.renal.model.KTSurgery;
import com.peradeniya.renal.services.KTSurgeryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transplant/kt-surgery")
public class KTSurgeryController {

    private final KTSurgeryService service;

    public KTSurgeryController(KTSurgeryService service) {
        this.service = service;
    }

    @PostMapping("/{phn}")
    public KTSurgery create(@RequestBody KTSurgery entity, @PathVariable String phn) {
        return service.save(entity, phn);
    }

    @GetMapping
    public List<KTSurgery> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public KTSurgery getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
