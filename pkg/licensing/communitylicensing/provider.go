package communitylicensing

import (
	"context"

	"github.com/SigNoz/signoz/pkg/errors"
	"github.com/SigNoz/signoz/pkg/factory"
	"github.com/SigNoz/signoz/pkg/licensing"
	"github.com/SigNoz/signoz/pkg/types/licensetypes"
	"github.com/SigNoz/signoz/pkg/valuer"
)

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

func (provider *communityLicensing) Activate(ctx context.Context, organizationID valuer.UUID, key string) error {
	return errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support license activation")
}

func (provider *communityLicensing) Validate(ctx context.Context) error {
	return nil
}

func (provider *communityLicensing) Refresh(ctx context.Context, organizationID valuer.UUID) error {
	return nil
}

func (provider *communityLicensing) Checkout(ctx context.Context, organizationID valuer.UUID, postableSubscription *licensetypes.PostableSubscription) (*licensetypes.GettableSubscription, error) {
	return nil, errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support checkout")
}

func (provider *communityLicensing) Portal(ctx context.Context, organizationID valuer.UUID, postableSubscription *licensetypes.PostableSubscription) (*licensetypes.GettableSubscription, error) {
	return nil, errors.New(errors.TypeUnsupported, licensing.ErrCodeUnsupported, "community edition does not support billing portal")
}

func (provider *communityLicensing) GetActive(ctx context.Context, organizationID valuer.UUID) (*licensetypes.License, error) {
	return communityLicense(organizationID), nil
}

var communityFeatureSet = []*licensetypes.Feature{
	{Name: licensetypes.SSO, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.Onboarding, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.ChatSupport, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.Gateway, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.PremiumSupport, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.AnomalyDetection, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
	{Name: licensetypes.DotMetricsEnabled, Active: true, Usage: 0, UsageLimit: -1, Route: ""},
}

func (provider *communityLicensing) GetFeatureFlags(_ context.Context, _ valuer.UUID) ([]*licensetypes.Feature, error) {
	return communityFeatureSet, nil
}

func (provider *communityLicensing) Collect(ctx context.Context, orgID valuer.UUID) (map[string]any, error) {
	return map[string]any{}, nil
}
