from googleads import ad_manager
import pymongo
from datetime import date, timedelta
import tempfile
import pandas as pd
from GAM_list import GAM_all_site, GAM_ent, GAM_other

path = 'googleads.yaml'
client = ad_manager.AdManagerClient.LoadFromStorage(path=path)


def get_impression(data, GAM_unit_name):
    """

    :param data: The pd.DataFrame
    :param GAM_unit_name: GAM_unit_name given from the list
    :return: The AD_SERVER_IMPRESSION value
    """
    try:
        return data[data["Dimension.AD_UNIT_NAME"] == GAM_unit_name][["Column.TOTAL_LINE_ITEM_LEVEL_IMPRESSIONS"]].values[0][0]
    except:
        return 0


class PredictGAM():
    def __init__(self, _date):
        self._date = _date
        self.data_collection = []
        self.predict_range = 4

        self.predict_site = 0
        self.predict_ent = 0
        self.predict_other = 0
        # self.predict_weekday()

    def get_data(self, some_date):
        report_query = self.generate_report_query(some_date)

        report = client.GetDataDownloader(version='v202005')
        report_id = report.WaitForReport(report_query)

        export_format = 'CSV'
        report_file = tempfile.NamedTemporaryFile(suffix='.csv', delete=False)
        report.DownloadReportToFile(report_id, export_format, report_file, use_gzip_compression=False)
        report_file.close()

        csv = pd.read_csv(report_file.name)
        self.data_collection.append(csv)

    def generate_report_query(self, some_date):
        return {
            'reportQuery': {
                'dimensions': ['AD_UNIT_NAME'],
                'columns': ['TOTAL_LINE_ITEM_LEVEL_IMPRESSIONS'],
                'dateRangeType': 'CUSTOM_DATE',
                'startDate': some_date - timedelta(days=1),
                'endDate': some_date
            }
        }

    def predict_weekday(self):
        weekday_all_site = []
        weekday_ent = []
        weekday_other = []

        for i in range(1, self.predict_range + 1):
            self.get_data(date.today() - timedelta(days=7 * i)) # APPENDING HERE
        # sum(self.data_collection)  # NEEDS MORE CONSIDERATION HERE

        for weekday_data in self.data_collection:
            weekday_all_site.append(self.get_site_impressions(weekday_data, GAM_all_site))
            weekday_ent.append(self.get_site_impressions(weekday_data, GAM_ent))
            weekday_other.append(self.get_site_impressions(weekday_data, GAM_other))

        self.predict_site = sum(weekday_all_site) / self.predict_range
        self.predict_ent = sum(weekday_ent) / self.predict_range
        self.predict_other = sum(weekday_other) / self.predict_range

    def get_site_impressions(self, data, GAM_units):
        impression = []
        for GAM_unit in GAM_units:
            impression.append(get_impression(data, GAM_unit))
        # impression_of_the_day = sum([self.get_impression(self, data, GAM_unit) for GAM_unit in GAM_units])
        impression_of_the_day = sum(impression)
        return impression_of_the_day

def insert_mongo(estimate):
    """insert to mongo DailyStamp"""
    mongo = pymongo.MongoClient("mongodb://localhost:27017/")
    dailystamps = mongo["dailystamps"]
    dailystamps.insert_one({"estimate":estimate})

# insert_mongo()

if __name__ == '__main__':
    predict = PredictGAM(date.today())
    predict.predict_weekday()
    print(predict.predict_site)
    print(predict.predict_ent)
    print(predict.predict_other)
