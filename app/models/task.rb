class Task < ApplicationRecord
  belongs_to :project

  def self.calculate_duration(task)
    counter = 0
    am = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    pm = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    s = task.start_time.strftime "%l"
    e = task.end_time.strftime "%l"

    calculate = false

    if (task.start_time.strftime "%P") == "am" && (task.end_time.strftime "%P") == "am"
      am.each do |h|
        if h.to_i == s.to_i
          calculate = true
        end
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    if ((task.start_time.strftime "%l") > (task.end_time.strftime "%l")) || ((task.end_time.strftime "%l").to_i == 12)
      pm.each do |h|
        if calculate == true
          counter = counter + 1
        end
      end

      am.each do |h|
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    #<!-- ********************* -->
    if (task.start_time.strftime "%P") == "pm" && (task.end_time.strftime "%P") == "pm"
      pm.each do |h|
        if h.to_i == s.to_i
          calculate = true
        end
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    if ((task.start_time.strftime "%l") > (task.end_time.strftime "%l")) || ((task.end_time.strftime "%l").to_i == 12)
      am.each do |h|
        if calculate == true
          counter = counter + 1
        end
      end

      pm.each do |h|
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    #<!-- ****************** -->
    if (task.start_time.strftime "%P") == "am" && (task.end_time.strftime "%P") == "pm"
      am.each do |h|
        if h.to_i == s.to_i
          calculate = true
        end
        if calculate == true
          counter = counter + 1
        end
      end

      pm.each do |h|
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    if (task.start_time.strftime "%P") == "pm" && (task.end_time.strftime "%P") == "am"
      pm.each do |h|
        if h.to_i == s.to_i
          calculate = true
        end
        if calculate == true
          counter = counter + 1
        end
      end

      am.each do |h|
        if calculate == true
          counter = counter + 1
        end
        if h.to_i == e.to_i
          calculate = false
        end
      end
    end

    m1 = task.start_time.strftime "%M"
    m2 = task.end_time.strftime "%M"

    s1 = task.start_time.strftime "%S"
    s2 = task.end_time.strftime "%S"

    #  <!-- hours = e.to_i - s.to_i if e > s || e == s
    #   hours = s.to_i - e.to_i if s > e
    #   hours = "0#{counter}" if hours < 10 -->

    hours = "#{counter - 1}"
    hours = "0#{counter - 1}" if hours.to_i < 10

    minutes = m2.to_i - m1.to_i if m2 > m1 || m2 == m1
    minutes = m1.to_i - m2.to_i if m1 > m2
    minutes = "0#{minutes}" if minutes < 10

    seconds = s2.to_i - s1.to_i if s2 > s1 || s2 == s1
    seconds = s1.to_i - s2.to_i if s1 > s2
    seconds = "0#{seconds}" if seconds < 10

    total = "#{hours}:#{minutes}:#{seconds}"
    return total
  end

  def self.report(tasks)
    week = []
    week_days = 0
    sun = ""

    while week_days < 7
      if "#{Date.today.strftime("%A")}" == "Sunday"
        week.push({day: (Date.today + week_days), duration: 0})
        week_days += 1
      elsif Date.today.strftime("%A") != "Sunday"
        find = false
        counter = 0
        while find == false
          sun = Date.today - counter
          if sun.strftime("%A") == "Sunday"
            week.push({day: (sun + week_days), duration: 0})
            week_days += 1
            find = true
          end
          counter += 1
        end
      end
    end

    puts week

    week.each do |day|
      hours = 0
      minutes = 0
      seconds = 0

      tasks.each do |task|
        if task.created_at.strftime("%B %d, %Y") == day[:day].strftime("%B %d, %Y")
          seconds = seconds + (task.duration[6..7]).to_i
          minutes = minutes + (task.duration[3..4]).to_i
          hours = hours + (task.duration[0..1]).to_i

          if seconds >= 60
            rest = seconds
            seconds = seconds - 60
            rest = rest - seconds
            minutes = minutes + (rest / 60)
          end

          if minutes >= 60
            rest = minutes
            minutes = minutes - 60
            rest = rest - minutes
            hours = hours + (rest / 60)
          end

          # seconds = "0#{seconds}" if seconds.to_i < 10
          # minutes = "0#{minutes}" if minutes.to_i < 10
          # hours = "0#{hours}" if hours.to_i < 10

          day[:duration] = hours
        end
      end
    end

    # counter = 1
    # arr = []

    # while counter <= 7
    #   tasks.each do |key, value|
    #     if (value.created_at.strftime("%B %d, %Y")) == (tasks[key + 1].created_at.strftime("%B %d, %Y"))
    #       arr.push({created_at: created_at.strftime("%A"), duration })
    #     end
    #   end
    # end

    week.map do |day|
      [
        day[:day].strftime("%A %B %d, %Y"),
        day[:duration].to_i,
      ]
    end
  end
end
