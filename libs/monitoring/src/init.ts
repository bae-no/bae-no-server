import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// Set an internal logger for open telemetry to report any issues to your console/stdout
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.WARN);

export const initTelemetry = (config: {
  appName: string;
  telemetryUrl: string;
}): void => {
  // create an exporter to an open telemetry exporter. We create this collector instance locally using docker compose.
  const exporter = new OTLPTraceExporter({
    url: config.telemetryUrl, // e.g. "http://otel-collector:4318/v1/traces",
  });

  // We add some common meta data to every trace. The service name is important.
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.appName,
      application: config.appName,
    }),
  );

  // We use the node trace provider provided by open telemetry
  const provider = new NodeTracerProvider({ resource });

  // The batch span provider is more efficient than the basic provider. This will batch sends to
  // the exporter you have configured
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  // Initialize the propagator
  provider.register({
    propagator: new W3CTraceContextPropagator(),
  });

  // Registering instrumentations / plugins
  registerInstrumentations({
    instrumentations: getNodeAutoInstrumentations(),
  });
};
