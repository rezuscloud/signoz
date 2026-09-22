package communitylicensing

import (
	"context"

	"github.com/SigNoz/signoz/pkg/errors"
	"github.com/SigNoz/signoz/pkg/factory"
	"github.com/SigNoz/signoz/pkg/licensing"
	"github.com/SigNoz/signoz/pkg/types/licensetypes"
	"github.com/SigNoz/signoz/pkg/valuer"
	"time"
)

// RZ: the community build ships with every licensed feature active — the
// ee/ tree is stripped and everything it implemented (SSO, ...) is our own
// code that must never be license-gated. This provider reports a permanent,
// valid, unlimited license.

type communityLicensing struct {
	stopChan chan struct{}
}

func NewFactory() factory.ProviderFactory[licensing.Licensing, licensing.Config] {
	return factory.NewProviderFactory(factory.MustNewName("community"), func(ctx context.Context, providerSettings factory.ProviderSettings, config licensing.Config) (licensing.Licensing, error) {
		return New(ctx, providerSettings, config)
	})
}

func New(_ context.Context, _ factory.ProviderSettings, _ licensing.Config) (licensing.Licensing, error) {
	return &communityLicensing{stopChan: make(chan struct{})}, nil
}

func (provider *communityLicensing) Start(context.Context) error {
	<-provider.stopChan
	return nil
}

func (provider *communityLicensing) Stop(context.Context) error {
	close(provider.stopChan)
	return nil
}

func (provider *communityLicensing) Activate(ctx context.Context, organizationID valuer.UUID, key string) (*licensetypes.License, error) {
	return nil, errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support license activation")
}

func (provider *communityLicensing) Validate(ctx context.Context) error {
	return nil
}

func (provider *communityLicensing) Refresh(ctx context.Context, organizationID valuer.UUID) error {
	return nil
}

func (provider *communityLicensing) GetActive(ctx context.Context, organizationID valuer.UUID) (*licensetypes.License, error) {
	return communityLicense(organizationID), nil
}

func (provider *communityLicensing) Get(ctx context.Context, organizationID valuer.UUID, licenseID valuer.UUID) (*licensetypes.License, error) {
	return communityLicense(organizationID), nil
}

func (provider *communityLicensing) List(ctx context.Context, organizationID valuer.UUID) ([]*licensetypes.License, error) {
	return []*licensetypes.License{communityLicense(organizationID)}, nil
}

func (provider *communityLicensing) Delete(ctx context.Context, organizationID valuer.UUID, licenseID valuer.UUID) error {
	return errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition license cannot be deleted")
}



// keep every feature key defined by licensetypes active.
var communityFeatureSet = []*licensetypes.Feature{
	{Name: licensetypes.SSO, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.Onboarding, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.ChatSupport, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.Gateway, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.PremiumSupport, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.AnomalyDetection, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
}

func (provider *communityLicensing) GetFeatureFlags(_ context.Context, _ valuer.UUID) ([]*licensetypes.Feature, error) {
	return communityFeatureSet, nil
}

func (provider *communityLicensing) Collect(ctx context.Context, orgID valuer.UUID) (map[string]any, error) {
	return map[string]any{}, nil
}

func communityLicense(organizationID valuer.UUID) *licensetypes.License {
	now := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	return &licensetypes.License{
		ID:       valuer.MustNewUUID(organizationID.StringValue()),
		Key:      "community",
		Plan: licensetypes.LicensePlan{
			Name:        licensetypes.PlanNameEnterprise,
			Description: "rezuscloud community build — all features active",
			IsActive:    true,
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		Features:        communityFeatureSet,
		Status:          valuer.NewString("VALID"),
		State:           valuer.NewString("ACTIVATED"),
		Platform:        licensetypes.LicensePlatformSelfHosted,
		ValidFrom:       now.Unix(),
		ValidUntil:      -1,
		CreatedAt:       now,
		UpdatedAt:       now,
		LastValidatedAt: time.Now(),
		OrganizationID:  organizationID,
	}
}
