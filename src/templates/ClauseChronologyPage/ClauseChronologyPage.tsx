import React, { PureComponent } from "react";
import ClausePageLayout from "src/components/ClausePageLayout";
import classes from "./ClauseChronologyPage.module.css";
import cn from "clsx";
import ChronologyConvictedDynamics from "./components/charts/ChronologyConvictedDynamics";
import ChronologyPunishmentDynamics from "./components/charts/ChronologyPunishmentDynamics";
import ClauseChronologyByResultTable from "./components/tables/ClauseChronologyByResultTable";
import ClauseChronologyByPunishmentTable from "./components/tables/ClauseChronologyByPunishmentTable";
import { T, withLocale, WithLocale } from "react-targem";
import { Helmet } from "react-helmet";

export type ClauseChronologyPageViewMode =
  | "page"
  | "table"
  | "iframe-convicted-dynamics"
  | "iframe-punishment-dynamics"
  | "iframe-table-chronology-by-result"
  | "iframe-table-chronology-by-punishment";

interface Year {
  year: number;
  totalConvicted: number; // Всего осуждено

  primaryImprisonment: number; // Лишение свободы
  primarySuspended: number; // Условное осуждение к лишению свободы
  primaryCommunityService: number; // Обязательные работы
  primaryForcedLabour: number; // Принудительные работы
  primaryCorrectionalLabour: number; // Исправительные работы
  primaryFine: number; // Штраф
  coerciveMeasures: number; // Принудительные меры к невменяемым
  primaryOther: number; // Условное осуждение к иным мерам

  totalAcquittal: number; // Оправдано
  dismissalAbsenceOfEvent: number; // Прекращено за отсутствием события, состава, непричастностью к преступлению
  dismissalAmnesty: number; // Прекращено по амнистии
  dismissalRepentance: number; // Прекращено в связи с деятельным раскаянием
  dismissalReconciliation: number; // Прекращено за примирением с потерпевшим
  dismissalCourtFine: number; // Прекращено судебный штраф
  dismissalOther: number; // Прекращено по другим основаниям
}

export interface ClauseChronologyPageProps extends WithLocale {
  clauseNumber: number;
  view: ClauseChronologyPageViewMode;
  partsCount: number;
  years: Year[];
}

class ClauseChronologyPage extends PureComponent<ClauseChronologyPageProps> {
  render(): React.ReactNode {
    const { clauseNumber, view, partsCount, t } = this.props;

    if (view === "iframe-convicted-dynamics") {
      return <ChronologyConvictedDynamics {...this.props} isIframeMode />;
    }

    if (view === "iframe-punishment-dynamics") {
      return <ChronologyPunishmentDynamics {...this.props} isIframeMode />;
    }

    return (
      <ClausePageLayout
        clauseNumber={clauseNumber}
        title={<T message="Хронология" />}
        pageType="chronology"
        hasParts={partsCount > 1}
      >
        {view === "page" ? (
          <div className={cn(classes.charts)}>
            <Helmet defer={false}>
              <title>
                {`${t("Статья")} ${clauseNumber} | ${t("Хронология")} | ${t(
                  "Чарты"
                )}`}
              </title>
              <meta
                name="description"
                content={t(
                  "На этой странице мы сравнили ключевые показатели по статье за период с 2009 по 2019 годы. Полноценных данных до 2009 года в открытом доступе не существует: Судебный департамент Верховного суда начал публиковать сводную статистику по рассмотрению судами уголовных дел после появления соответствующего закона и регламента в 2008 году."
                )}
              />
            </Helmet>
            <div className={cn(classes.chartContainer)}>
              <T message="На этой странице мы сравнили ключевые показатели по статье за период с 2009 по 2019 годы. Полноценных данных до 2009 года в открытом доступе не существует: Судебный департамент Верховного суда начал публиковать сводную статистику по рассмотрению судами уголовных дел после появления соответствующего закона и регламента в 2008 году." />
            </div>
            <div className={cn(classes.chartContainer)}>
              <ChronologyConvictedDynamics {...this.props} />
            </div>
            <div
              className={cn(
                classes.chartContainer,
                classes.chartContainerFullWidth
              )}
            >
              <ChronologyPunishmentDynamics {...this.props} />
            </div>
          </div>
        ) : null}
        {view === "table" ? (
          <>
            <Helmet defer={false}>
              <title>
                {`${t("Статья")} ${clauseNumber} | ${t("Хронология")} | ${t(
                  "Таблица"
                )}`}
              </title>
              <meta
                name="description"
                content={t(
                  "На этой странице мы сравнили ключевые показатели по статье за период с 2009 по 2019 годы. Полноценных данных до 2009 года в открытом доступе не существует: Судебный департамент Верховного суда начал публиковать сводную статистику по рассмотрению судами уголовных дел после появления соответствующего закона и регламента в 2008 году."
                )}
              />
            </Helmet>
            <div className={cn(classes.tableContainer)}>
              <ClauseChronologyByResultTable {...this.props} />
            </div>
            <div className={cn(classes.tableContainer)}>
              <ClauseChronologyByPunishmentTable {...this.props} />
            </div>
          </>
        ) : null}
      </ClausePageLayout>
    );
  }
}

export default withLocale(ClauseChronologyPage);
