import { listMeasurements, listResults, showMeasurement } from '../actions'
import log from 'electron-log'
import Sentry from '@sentry/electron'
import { Ooniprobe } from '../utils/ooni/ooniprobe'

jest.mock('electron-util', () => ({
  is: {
    development: true,
    macos: false,
    linux: true,
    windows: false,
  },
}))

log.debug = jest.fn()
log.info = jest.fn()
log.verbose = jest.fn()
log.error = jest.fn()

Sentry.addBreadcrumb = jest.fn()

jest.mock('../utils/ooni/ooniprobe', () => ({
  Ooniprobe: jest.fn(),
}))

// listMeasurements
describe('Tests for listMeasurements', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('measured_item field type is pushed to rows', async () => {
    const line = {
      fields: {
        asn: 55836,
        failure_msg: '',
        id: 23,
        is_anomaly: false,
        is_done: true,
        is_failed: false,
        is_first: true,
        is_last: false,
        is_upload_failed: false,
        is_uploaded: true,
        measurement_file_path:
          '/probe-desktop/ooni_home/msmts/circumvention-2021-08-17T064949.497060661Z/msmt-psiphon-0.json',
        network_country_code: 'IN',
        network_name: 'Network_XYZ',
        report_file_path: '',
        runtime: 12.381846693,
        start_time: '2021-08-17T06:49:49.772416785Z',
        test_group_name: 'circumvention',
        test_keys: '{"bootstrap_time":10.843228724,"failure":""}',
        test_name: 'psiphon',
        type: 'measurement_item',
        upload_failure_msg: '',
        url: '',
        url_category_code: '',
        url_country_code: '',
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(line)
        return
      }),
      call: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      ),
    }))

    const resolvedOutput = await listMeasurements('11')

    expect(resolvedOutput.rows[0]).toEqual(line.fields)
  })

  test('measurement_summary field type is pushed to summary', async () => {
    const line = {
      fields: {
        anomaly_count: 0,
        asn: 55836,
        data_usage_down: 5.5634765625,
        data_usage_up: 12.17578125,
        network_country_code: 'IN',
        network_name: 'Network_XYZ',
        start_time: '2021-08-17T06:49:49.772416785Z',
        total_count: 3,
        total_runtime: 0,
        type: 'measurement_summary',
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(line)
        return
      }),
      call: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      ),
    }))

    const resolvedOutput = await listMeasurements('11')

    expect(resolvedOutput.summary).toEqual(line.fields)
  })
})

// listResults
describe('Tests for listResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('list_item field type is pushed to rows', async () => {
    const line = {
      fields: {
        asn: 55836,
        data_usage_down: 30.87109375,
        data_usage_up: 146.2041015625,
        id: 1,
        index: 0,
        is_done: true,
        is_uploaded: false,
        measurement_anomaly_count: 1,
        measurement_count: 4,
        name: 'im',
        network_country_code: 'IN',
        network_name: 'Network_XYZ',
        runtime: 0,
        start_time: '2021-08-16T18:41:16.559453057Z',
        test_keys: '{}',
        total_count: 9,
        type: 'result_item',
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(line)
        return
      }),
      call: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      ),
    }))

    const resolvedOutput = await listResults()

    expect(resolvedOutput.rows[0]).toEqual(line.fields)
  })

  test('result_summary field type is assigned to summary', async () => {
    const summaryLine = {
      fields: {
        type: 'result_summary',
        total_tests: 9,
        total_networks: 1,
        total_data_usage_up: 18150.4853515625,
        total_data_usage_down: 240405.09765625,
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(summaryLine)
        return
      }),
      call: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      ),
    }))

    const resolvedOutputSummary = await listResults()

    expect(resolvedOutputSummary.testCount).toEqual(
      summaryLine.fields.total_tests
    )
    expect(resolvedOutputSummary.networkCount).toEqual(
      summaryLine.fields.total_networks
    )
    expect(resolvedOutputSummary.dataUsageUp).toEqual(
      summaryLine.fields.total_data_usage_up
    )
    expect(resolvedOutputSummary.dataUsageDown).toEqual(
      summaryLine.fields.total_data_usage_down
    )
  })
})

// showMeasurement
describe('Tests for showMeasurement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('result_summary field type is assigned to summary', async () => {
    const measurementData = {
      fields: {
        type: 'measurement_json',
        measurement_json: {
          annotations: {
            engine_name: 'ooniprobe-engine',
            engine_version: '3.10.0-beta.3',
            platform: 'linux',
          },
          data_format_version: '0.2.0',
          input: 'https://www.hrw.org/',
          measurement_start_time: '2021-08-17 06:49:33',
          probe_asn: 'AS55836',
          probe_cc: 'IN',
          probe_ip: '127.0.0.1',
          probe_network_name: 'Network_XYZ',
          report_id:
            '20210817T064923Z_webconnectivity_IN_55836_n1_szxLB55vUx8Pn1YU',
          resolver_asn: 'AS55836',
          resolver_ip: '49.45.32.179',
          resolver_network_name: 'Network_XYZ',
          software_name: 'ooniprobe-desktop',
          software_version: '3.5.2',
          test_helpers: {
            backend: { address: 'https://wcth.ooni.io', type: 'https' },
          },
          test_keys: {
            accessible: true,
            agent: 'redirect',
            blocking: false,
            body_length_match: null,
            body_proportion: 0,
            client_resolver: '49.45.32.179',
            control_failure: null,
            dns_consistency: 'consistent',
            dns_experiment_failure: null,
            headers_match: true,
            http_experiment_failure: null,
            retries: null,
            socksproxy: null,
            status_code_match: true,
            title_match: null,
            x_status: 1,
          },
          test_name: 'web_connectivity',
          test_runtime: 6.306615536,
          test_start_time: '2021-08-17 06:49:23',
          test_version: '0.4.0',
        },
      },
      level: 'info',
      timestamp: '2021-08-10T16:43:23.463179849+05:30',
      message: 'result summary',
    }

    Ooniprobe.mockImplementation(() => ({
      on: jest.fn((event, callback) => {
        callback(measurementData)
        return
      }),
      call: jest.fn(
        () =>
          new Promise((resolve) => {
            resolve()
          })
      ),
    }))

    const resolvedMeasurement = await showMeasurement('22')

    expect(resolvedMeasurement).toEqual(measurementData.fields.measurement_json)
  })
})
