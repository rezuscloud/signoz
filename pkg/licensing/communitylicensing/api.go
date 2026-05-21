package communitylicensing

import (
	"net/http"
	"time"

	"github.com/SigNoz/signoz/pkg/errors"
	"github.com/SigNoz/signoz/pkg/http/render"
	"github.com/SigNoz/signoz/pkg/licensing"
	"github.com/SigNoz/signoz/pkg/types/licensetypes"
	"github.com/SigNoz/signoz/pkg/valuer"
)

type communityLicensingAPI struct{}

func NewLicenseAPI() licensing.API {
	return &communityLicensingAPI{}
}

type communityLicenseResponse struct {
	Key        string                       `json:"key"`
	Status     string                       `json:"status"`
	State      string                       `json:"state"`
	EventQueue communityEventQueueResponse  `json:"event_queue"`
	Platform   string                       `json:"platform"`
	CreatedAt  string                       `json:"created_at"`
	Plan       communityPlanResponse        `json:"plan"`
	PlanID     string                       `json:"plan_id"`
	FreeUntil  string                       `json:"free_until"`
	UpdatedAt  string                       `json:"updated_at"`
	ValidFrom  int64                        `json:"valid_from"`
	ValidUntil int64                        `json:"valid_until"`
}

type communityEventQueueResponse struct {
	Event       string `json:"event"`
	Status      string `json:"status"`
	ScheduledAt string `json:"scheduled_at"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}

type communityPlanResponse struct {
	CreatedAt   string `json:"created_at"`
	Description string `json:"description"`
	IsActive    bool   `json:"is_active"`
	Name        string `json:"name"`
	UpdatedAt   string `json:"updated_at"`
}

func communityLicense(organizationID valuer.UUID) *licensetypes.License {
	return &licensetypes.License{
		ID:       valuer.MustNewUUID(organizationID.StringValue()),
		Key:      "community",
		PlanName: licensetypes.PlanNameBasic,
		Features: communityFeatureSet,
		Status:   valuer.NewString("VALID"),
		State:    "ACTIVATED",
		ValidFrom: func() int64 {
			t := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
			return t.Unix()
		}(),
		ValidUntil:      -1,
		CreatedAt:       time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		UpdatedAt:       time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC),
		LastValidatedAt: time.Now(),
		OrganizationID:  organizationID,
	}
}

func (api *communityLicensingAPI) Activate(rw http.ResponseWriter, r *http.Request) {
	now := time.Now().UTC().Format(time.RFC3339)
	render.Success(rw, http.StatusOK, communityLicenseResponse{
		Key:    "community",
		Status: "VALID",
		State:  "ACTIVATED",
		EventQueue: communityEventQueueResponse{
			Event:       "",
			Status:      "",
			ScheduledAt: "",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		Platform:  "SELF_HOSTED",
		CreatedAt: now,
		Plan: communityPlanResponse{
			CreatedAt:   now,
			Description: "SigNoz Community Edition",
			IsActive:    true,
			Name:        "basic",
			UpdatedAt:   now,
		},
		PlanID:    "community",
		FreeUntil: "",
		UpdatedAt: now,
		ValidFrom: time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC).Unix(),
		ValidUntil: -1,
	})
}

func (api *communityLicensingAPI) GetActive(rw http.ResponseWriter, r *http.Request) {
	api.Activate(rw, r)
}

func (api *communityLicensingAPI) Refresh(rw http.ResponseWriter, r *http.Request) {
	api.Activate(rw, r)
}

func (api *communityLicensingAPI) Checkout(rw http.ResponseWriter, r *http.Request) {
	render.Error(rw, errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support checkout"))
}

func (api *communityLicensingAPI) Portal(rw http.ResponseWriter, r *http.Request) {
	render.Error(rw, errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support billing portal"))
}


