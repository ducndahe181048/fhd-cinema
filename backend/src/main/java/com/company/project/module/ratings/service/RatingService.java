package com.company.project.module.ratings.service;

import java.util.List;

import com.company.project.common.ApiPagination;
import com.company.project.common.Status;
import com.company.project.module.ratings.common.RatingStatusMessage;
import com.company.project.module.ratings.dto.request.RatingCreationRequest;
import com.company.project.module.ratings.entity.Rating;
import com.company.project.module.ratings.exception.RatingException;
import com.company.project.module.ratings.repository.RatingRepository;
import com.company.project.utils.Utils;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    public final RatingRepository ratingRepository;
    public final Utils utils;

    public RatingService(RatingRepository ratingRepository, Utils utils) {
        this.ratingRepository = ratingRepository;
        this.utils = utils;
    }

    public List<Rating> getAllRatings() {
        return ratingRepository.findAll();
    }

    public Rating getRatingById(String ratingId) {
        return ratingRepository.findById(ratingId).orElseThrow(() -> new RatingException(Status.FAIL.getValue(), RatingStatusMessage.NOT_EXIST.getMessage()));
    }

    public ApiPagination<Rating> filterRatings(String ratingName, int page, int pageSize,
          String sortBy, String sortDirection) {
      if (page < 1 || pageSize < 1) {
        throw new RatingException(Status.FAIL.getValue(), RatingStatusMessage.LESS_THAN_ZERO.getMessage());
      }

      List<String> ratingFieldNames = utils.getEntityFields(Rating.class);

      if (!ratingFieldNames.contains(sortBy)) {
        throw new RatingException(Status.FAIL.getValue(), RatingStatusMessage.UNKNOWN_ATTRIBUTE.getMessage());
      }

      Sort.Direction direction = Sort.Direction.fromString(sortDirection);

      Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by(direction, sortBy));

      Page<Rating> ratingPages = ratingRepository.findByRatingNameContainingIgnoreCase(ratingName, pageable);
      long count = ratingRepository.countByRatingNameContainingIgnoreCase(ratingName);

      ApiPagination<Rating> ratingPagination = ApiPagination.<Rating>builder()
          .result(ratingPages.getContent())
          .count(count)
          .build();
      
      return ratingPagination;
    }

    public Rating createRating(RatingCreationRequest request) {
        Rating rating = Rating.builder()
                .ratingName(request.getRatingName())
                .ratingDescription(request.getRatingDescription())
                .build();

        return ratingRepository.save(rating);
    }

    public Rating updateRating(String ratingId, RatingCreationRequest request) {
        Rating existedRating = getRatingById(ratingId);

        existedRating.setRatingName(request.getRatingName());
        existedRating.setRatingDescription(request.getRatingDescription());

        return ratingRepository.save(existedRating);
    }

    public void deleteRating(String ratingId) {
        if(!ratingRepository.existsByRatingId(ratingId)) {
            throw new RatingException(Status.FAIL.getValue(), RatingStatusMessage.NOT_EXIST.getMessage());
        }

        ratingRepository.deleteById(ratingId);
    }

}
